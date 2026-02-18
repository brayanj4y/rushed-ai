import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
    adjectives,
    animals,
    colors,
    uniqueNamesGenerator,
} from "unique-names-generator";

import { convex } from "@/lib/convex-client";

import { api } from "../../../../../convex/_generated/api";

export async function POST() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const internalKey = process.env.RUSHED_CONVEX_INTERNAL_KEY;

    if (!internalKey) {
        return NextResponse.json(
            { error: "Internal key not configured" },
            { status: 500 }
        );
    }

    // Generate a random project name
    const projectName = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors],
        separator: "-",
        length: 3,
    });

    // Create blank project without conversation
    const projectId = await convex.mutation(
        api.system.createProject,
        {
            internalKey,
            name: projectName,
            ownerId: userId,
        },
    );

    return NextResponse.json({ projectId });
}
