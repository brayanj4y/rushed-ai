import { z } from "zod";
import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { anthropic } from "@ai-sdk/anthropic";

import { firecrawl } from "@/lib/firecrawl";
import { convex } from "@/lib/convex-client";
import { CREDIT_ERROR_MESSAGES } from "@/lib/credits";

import { api } from "../../../../convex/_generated/api";

const quickEditSchema = z.object({
  editedCode: z
    .string()
    .describe(
      "The edited version of the selected code based on the instruction"
    ),
});

const URL_REGEX = /https?:\/\/[^\s)>\]]+/g;

const QUICK_EDIT_PROMPT = `You are a code editing assistant. Edit the selected code based on the user's instruction.

<context>
<selected_code>
{selectedCode}
</selected_code>
<full_code_context>
{fullCode}
</full_code_context>
</context>

{documentation}

<instruction>
{instruction}
</instruction>

<instructions>
Return ONLY the edited version of the selected code.
Maintain the same indentation level as the original.
Do not include any explanations or comments unless requested.
If the instruction is unclear or cannot be applied, return the original code unchanged.
</instructions>`;

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const { selectedCode, fullCode, instruction } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 400 }
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
          { status: 403 }
        );
      }
    }


    if (!selectedCode) {
      return NextResponse.json(
        { error: "Selected code is required" },
        { status: 400 }
      );
    }

    if (!instruction) {
      return NextResponse.json(
        { error: "Instruction is required" },
        { status: 400 }
      );
    }

    const urls: string[] = instruction.match(URL_REGEX) || [];
    let documentationContext = "";

    if (urls.length > 0) {
      const scrapedResults = await Promise.all(
        urls.map(async (url) => {
          try {
            const result = await firecrawl.scrape(url, {
              formats: ["markdown"],
            });

            if (result.markdown) {
              return `<doc url="${url}">\n${result.markdown}\n</doc>`;
            }

            return null;
          } catch {
            return null;
          }
        })
      );

      const validResults = scrapedResults.filter(Boolean);

      if (validResults.length > 0) {
        documentationContext = `<documentation>\n${validResults.join("\n\n")}\n</documentation>`;
      }
    }

    const prompt = QUICK_EDIT_PROMPT
      .replace("{selectedCode}", selectedCode)
      .replace("{fullCode}", fullCode || "")
      .replace("{instruction}", instruction)
      .replace("{documentation}", documentationContext);

    const { output, usage } = await generateText({
      model: anthropic("claude-3-7-sonnet-20250219"),
      output: Output.object({ schema: quickEditSchema }),
      prompt,
    });


    if (internalKey && userId) {
      try {
        await convex.mutation(api.credits.deductCredits, {
          internalKey,
          userId,
          inputTokens: usage.inputTokens ?? 0,
          outputTokens: usage.outputTokens ?? 0,
          description: "Quick edit",
          relatedTo: "quick_edit",
        });
      } catch (error) {
        console.error("Credit deduction error:", error);
      }
    }

    return NextResponse.json({ editedCode: output.editedCode });
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json(
      { error: "Failed to generate edit" },
      { status: 500 }
    );
  }
};
