"use client";

import { useState, useEffect } from "react";
import { FaGithub, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ky from "ky";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";

import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";

import { ProjectsList } from "./projects-list";
import { ProjectsCommandDialog } from "./projects-command-dialog";
import { ImportGithubDialog } from "./import-github-dialog";

import { Id } from "../../../../convex/_generated/dataModel";


export const ProjectsView = () => {
  const router = useRouter();
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingBlank, setIsCreatingBlank] = useState(false);

  // Handle prompt submission - creates project with AI prompt
  const handlePromptSubmit = async (message: PromptInputMessage) => {
    if (!message.text) return;

    setIsSubmitting(true);

    try {
      const { projectId } = await ky
        .post("/api/projects/create-with-prompt", {
          json: { prompt: message.text.trim() },
        })
        .json<{ projectId: Id<"projects"> }>();

      toast.success("Project created");
      setInput("");
      router.push(`/projects/${projectId}`);
    } catch {
      toast.error("Unable to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle blank project creation
  const handleCreateBlank = async () => {
    setIsCreatingBlank(true);

    try {
      const { projectId } = await ky
        .post("/api/projects/create")
        .json<{ projectId: Id<"projects"> }>();

      toast.success("Project created");
      router.push(`/projects/${projectId}`);
    } catch {
      toast.error("Unable to create project");
    } finally {
      setIsCreatingBlank(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "k") {
          e.preventDefault();
          setCommandDialogOpen(true);
        }
        if (e.key === "i") {
          e.preventDefault();
          setImportDialogOpen(true);
        }
        if (e.key === "j") {
          e.preventDefault();
          handleCreateBlank();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <ProjectsCommandDialog
        open={commandDialogOpen}
        onOpenChange={setCommandDialogOpen}
      />
      <ImportGithubDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />
      <div className="min-h-screen bg-sidebar flex flex-col items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-md mx-auto flex flex-col gap-4 items-center">

          <div className="flex justify-between gap-4 w-full items-center">
            <div className="flex items-center gap-2 w-full group/logo">
              <img src="/logo.png" alt="Rushed" className="size-[32px] md:size-[46px]" />
              <h1 className={cn(
                "text-4xl md:text-5xl font-semibold font-logo",
              )}>
                Rushed
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            {/* Inline Prompt Input */}
            <PromptInput onSubmit={handlePromptSubmit} className="bg-background rounded-xl overflow-hidden">
              <PromptInputBody>
                <PromptInputTextarea
                  placeholder="Yo, tell Rushed what to build!"
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  disabled={isSubmitting}
                />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools />
                <PromptInputSubmit disabled={!input || isSubmitting} />
              </PromptInputFooter>
            </PromptInput>

            {/* New and Import buttons - consistent styling */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={handleCreateBlank}
                disabled={isCreatingBlank}
                className="h-10 bg-card border-border"
              >
                <FaPlus className="size-3.5" />
                <span>New</span>
                <Kbd className="ml-auto">⌘J</Kbd>
              </Button>
              <Button
                variant="outline"
                onClick={() => setImportDialogOpen(true)}
                className="h-10 bg-card border-border"
              >
                <FaGithub className="size-4" />
                <span>Import</span>
                <Kbd className="ml-auto">⌘I</Kbd>
              </Button>
            </div>

            <ProjectsList onViewAll={() => setCommandDialogOpen(true)} />

          </div>

        </div>
      </div>
    </>
  );
};
