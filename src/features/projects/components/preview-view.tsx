"use client";

import { useState, useRef } from "react";
import { Allotment } from "allotment";
import { HugeiconsIcon } from "@hugeicons/react"
import { RefreshIcon, Copy01Icon, ComputerTerminal01Icon, Alert02Icon } from "@hugeicons/core-free-icons"

import { useWebContainer } from "@/features/preview/hooks/use-webcontainer";
import { PreviewSettingsPopover } from "@/features/preview/components/preview-settings-popover";
import { PreviewTerminal } from "@/features/preview/components/preview-terminal";
import { Shimmer } from "@/components/ai-elements/shimmer";

import { Button } from "@/components/ui/button";

import { useProject } from "../hooks/use-projects";

import { Id } from "../../../../convex/_generated/dataModel";

export const PreviewView = ({ projectId }: { projectId: Id<"projects"> }) => {
  const project = useProject(projectId);
  const [showTerminal, setShowTerminal] = useState(true);


  const {
    status, previewUrl, error, restart, terminalOutput
  } = useWebContainer({
    projectId,
    enabled: true,
    settings: project?.settings,
  });

  const isLoading = status === "booting" || status === "installing";

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between p-2 px-4 gap-2 border-b bg-sidebar shrink-0">
        <div className="flex items-center gap-2">
          <Button
            size="icon-sm"
            variant="ghost"
            className="rounded-full"
            onClick={restart}
            disabled={isLoading}
          >
            <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className={isLoading ? "animate-spin size-4" : "size-4"} />
          </Button>
        </div>

        <div className="flex-1 max-w-xl mx-auto flex items-center h-8 px-3 bg-background/50 border rounded-full text-xs text-muted-foreground shadow-sm">
          {isLoading ? (
            <div className="flex items-center gap-2 w-full justify-center">
              <Shimmer className="text-xs">
                {status === "booting" ? "Starting container..." : "Installing packages..."}
              </Shimmer>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full gap-2 group">
              <span className="truncate max-w-[300px]">{previewUrl || "https://localhost:3000"}</span>
              {previewUrl && (
                <Button
                  size="icon-xs"
                  variant="ghost"
                  className="size-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => navigator.clipboard.writeText(previewUrl)}
                >
                  <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3" />
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon-sm"
            variant={showTerminal ? "secondary" : "ghost"}
            className="rounded-full"
            onClick={() => setShowTerminal((v) => !v)}
          >
            <HugeiconsIcon icon={ComputerTerminal01Icon} strokeWidth={2} className="size-4" />
          </Button>
          <PreviewSettingsPopover
            projectId={projectId}
            initialValues={project?.settings}
            onSave={restart}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <Allotment vertical>
          <Allotment.Pane>
            {error && (
              <div className="size-full flex items-center justify-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2 max-w-md mx-auto text-center">
                  <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-6" />
                  <p className="text-sm font-medium">{error}</p>
                  <Button size="sm" variant="outline" onClick={restart}>
                    <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} className="size-4" />
                    Restart
                  </Button>
                </div>
              </div>
            )}

            {isLoading && !error && (
              <div className="size-full flex items-center justify-center text-muted-foreground">
                <div className="flex flex-col items-center gap-4 max-w-md mx-auto text-center">
                  <Shimmer as="h3" className="font-semibold text-lg">
                    {status === "booting" ? "Starting container..." : "Installing packages..."}
                  </Shimmer>
                </div>
              </div>
            )}

            {previewUrl && (
              <iframe
                src={previewUrl}
                className="size-full border-0"
                title="Preview"
              />
            )}
          </Allotment.Pane>

          {showTerminal && (
            <Allotment.Pane minSize={100} maxSize={500} preferredSize={200}>
              <div className="h-full flex flex-col bg-background border-t">
                <div className="h-7 flex items-center px-3 text-xs gap-1.5 text-muted-foreground border-b border-border/50 shrink-0">
                  <HugeiconsIcon icon={ComputerTerminal01Icon} strokeWidth={2} className="size-3" />
                  Terminal
                </div>
                <PreviewTerminal output={terminalOutput} />
              </div>
            </Allotment.Pane>
          )}
        </Allotment>
      </div>
    </div>
  );
};
