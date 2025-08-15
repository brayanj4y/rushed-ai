import { getUsageStatus } from "@/lib/usage";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getUsageStatus();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
