import { useState, useEffect, useRef } from "react";

import { useFile, useUpdateFile } from "@/features/projects/hooks/use-files";

import { CodeEditor } from "./code-editor";
import { useEditor } from "../hooks/use-editor";
import { TopNavigation } from "./top-navigation";
import { FileBreadcrumbs } from "./file-breadcrumbs";
import { ProjectsCommandDialog } from "@/features/projects/components/projects-command-dialog";
import { Id } from "../../../../convex/_generated/dataModel";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon } from "@hugeicons/core-free-icons";

const DEBOUNCE_MS = 1500;

export const EditorView = ({ projectId }: { projectId: Id<"projects"> }) => {
  const { activeTabId } = useEditor(projectId);
  const activeFile = useFile(activeTabId);
  const updateFile = useUpdateFile();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);

  const isActiveFileBinary = activeFile && activeFile.storageId;
  const isActiveFileText = activeFile && !activeFile.storageId;

  // Cleanup pending debounced updates on unmount or file change
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeTabId]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandDialogOpen(true);
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
      <div className="h-full flex flex-col">
        <div className="flex items-center">
          <TopNavigation projectId={projectId} />
        </div>
        {activeTabId && <FileBreadcrumbs projectId={projectId} />}
        <div className="flex-1 min-h-0 bg-background">
          {!activeFile && (
            <div className="size-full flex items-center justify-center flex-col gap-6">
              <span className="text-8xl opacity-45 font-logo-dot select-none">
                Rushed
              </span>
              <div className="flex gap-8 text-muted-foreground/60 text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-muted px-1.5 py-0.5 rounded text-xs">@</span>
                  <span>Type @ to tag files</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-muted px-1.5 py-0.5 rounded text-xs">Select</span>
                  <span>Select code to chat</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-muted px-1.5 py-0.5 rounded text-xs">⌘ K</span>
                  <span>Search projects</span>
                </div>
              </div>
            </div>
          )}
          {isActiveFileText && (
            <CodeEditor
              key={activeFile._id}
              fileName={activeFile.name}
              initialValue={activeFile.content}
              onChange={(content: string) => {
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                }

                timeoutRef.current = setTimeout(() => {
                  updateFile({ id: activeFile._id, content });
                }, DEBOUNCE_MS);
              }}
            />
          )}
          {isActiveFileBinary && (
            <div className="size-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-2.5 max-w-md text-center">
                <HugeiconsIcon icon={Alert02Icon} className="size-10 text-yellow-500" />
                <p className="text-sm">
                  The file is not displayed in the text editor because it is either binary or uses an unsupported text encoding.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
