import { Sandbox } from "@e2b/code-interpreter"

import { createAgent, anthropic } from "@inngest/agent-kit";
import { inngest } from "./client";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("rushed-nextjs-template");
      return sandbox.sandboxId;
    });
    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert next.js developer.  You write readable, maintanable code, you write simple next.js and react snippets.",
      model: anthropic({
        model: "claude-3-5-sonnet-latest",
        defaultParameters: { max_tokens: 4096 },
      }),
    });

    const { output } = await codeAgent.run(
      `Write the following snippet: ${event.data.value}`,
    );

    const sandboxUrl = await step.run("getsandbox-url", async() => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });


    return { output, sandboxUrl };

  },
);