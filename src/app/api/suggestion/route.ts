import { generateText, Output } from "ai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { anthropic } from "@ai-sdk/anthropic";

import { convex } from "@/lib/convex-client";
import { CREDIT_ERROR_MESSAGES } from "@/lib/credits";

import { api } from "../../../../convex/_generated/api";

const suggestionSchema = z.object({
  suggestion: z
    .string()
    .describe(
      "The code to insert at cursor, or empty string if no completion needed"
    ),
});

const SUGGESTION_PROMPT = `You are a code suggestion assistant.

<context>
<file_name>{fileName}</file_name>
<previous_lines>
{previousLines}
</previous_lines>
<current_line number="{lineNumber}">{currentLine}</current_line>
<before_cursor>{textBeforeCursor}</before_cursor>
<after_cursor>{textAfterCursor}</after_cursor>
<next_lines>
{nextLines}
</next_lines>
<full_code>
{code}
</full_code>
</context>

<instructions>
Follow these steps IN ORDER:

1. First, look at next_lines. If next_lines contains ANY code, check if it continues from where the cursor is. If it does, return empty string immediately - the code is already written.

2. Check if before_cursor ends with a complete statement (;, }, )). If yes, return empty string.

3. Only if steps 1 and 2 don't apply: suggest what should be typed at the cursor position, using context from full_code.

Your suggestion is inserted immediately after the cursor, so never suggest code that's already in the file.
</instructions>`;

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 },
      );
    }

    // Pre-flight credit check
    const internalKey = process.env.RUSHED_CONVEX_INTERNAL_KEY;
    if (internalKey) {
      const creditCheck = await convex.mutation(api.credits.checkCredits, {
        internalKey,
        userId,
      });

      if (!creditCheck.allowed) {
        const errorMessage = CREDIT_ERROR_MESSAGES[creditCheck.error ?? ""]
          ?? "Unable to process request. Please check your subscription.";
        return NextResponse.json(
          { error: errorMessage, code: creditCheck.error },
          { status: 403 },
        );
      }
    }

    const {
      fileName,
      code,
      currentLine,
      previousLines,
      textBeforeCursor,
      textAfterCursor,
      nextLines,
      lineNumber,
    } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    const prompt = SUGGESTION_PROMPT
      .replace("{fileName}", fileName)
      .replace("{code}", code)
      .replace("{currentLine}", currentLine)
      .replace("{previousLines}", previousLines || "")
      .replace("{textBeforeCursor}", textBeforeCursor)
      .replace("{textAfterCursor}", textAfterCursor)
      .replace("{nextLines}", nextLines || "")
      .replace("{lineNumber}", lineNumber.toString());

    const { output, usage } = await generateText({
      model: anthropic("claude-3-7-sonnet-20250219"),
      output: Output.object({ schema: suggestionSchema }),
      prompt,
    });

    // Deduct credits based on actual token usage
    if (internalKey && userId) {
      try {
        await convex.mutation(api.credits.deductCredits, {
          internalKey,
          userId,
          inputTokens: usage.inputTokens ?? 0,
          outputTokens: usage.outputTokens ?? 0,
          description: "Code suggestion",
          relatedTo: "suggestion",
        });
      } catch (error) {
        console.error("Credit deduction error:", error);
      }
    }

    return NextResponse.json({ suggestion: output.suggestion })
  } catch (error) {
    console.error("Suggestion error: ", error);
    return NextResponse.json(
      { error: "Failed to generate suggestion" },
      { status: 500 },
    );
  }
}
