import { z } from "zod";
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

import { convex } from "@/lib/convex-client";
import { inngest } from "@/inngest/client";

import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";

const requestSchema = z.object({
  projectId: z.string(),
  repoName: z.string().min(1).max(100),
  visibility: z.enum(["public", "private"]).default("private"),
  description: z.string().max(350).optional(),
});

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check subscription via Convex (Dodo Payments), not Clerk
  const internalKey = process.env.RUSHED_CONVEX_INTERNAL_KEY;
  if (!internalKey) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const creditCheck = await convex.mutation(api.credits.checkCredits, {
    internalKey,
    userId,
  });

  if (!creditCheck.allowed) {
    return NextResponse.json({ error: "Pro plan required" }, { status: 403 });
  }

  const body = await request.json();
  const { projectId, repoName, visibility, description } = requestSchema.parse(body);

  const client = await clerkClient();
  const tokens = await client.users.getUserOauthAccessToken(userId, "github");
  const githubToken = tokens.data[0]?.token;

  if (!githubToken) {
    return NextResponse.json(
      { error: "GitHub not connected. Please reconnect your GitHub account." },
      { status: 400 }
    );
  }



  const event = await inngest.send({
    name: "github/export.repo",
    data: {
      projectId,
      repoName,
      visibility,
      description,
      githubToken,
      internalKey,
    },
  });

  return NextResponse.json({
    success: true,
    projectId,
    eventId: event.ids[0]
  });
};
