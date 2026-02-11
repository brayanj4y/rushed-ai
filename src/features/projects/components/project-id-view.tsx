"use client";

import { useState } from "react";
import { Allotment } from "allotment";
import { FaGithub } from "react-icons/fa";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EditorView } from "@/features/editor/components/editor-view";
import { useFiles } from "../hooks/use-files";
import { useProject } from "../hooks/use-projects";
import { ImportGithubDialog } from "./import-github-dialog";

import { FileExplorer } from "./file-explorer";
import { Id } from "../../../../convex/_generated/dataModel";
import { PreviewView } from "./preview-view";
import { ExportPopover } from "./export-popover";

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_SIDEBAR_WIDTH = 350;
const DEFAULT_MAIN_SIZE = 1000;



export const ProjectIdView = ({
  projectId
}: {
  projectId: Id<"projects">
}) => {
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const project = useProject(projectId);
  const files = useFiles(projectId);

  const showImport = !project?.importStatus && (files?.length ?? 0) === 0;

  return (
    <div className="h-full flex flex-col bg-sidebar rounded-xl border overflow-hidden">
      <ImportGithubDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />
      <nav className={cn(
        "flex items-center justify-between p-2 px-4 gap-2 transition-colors",
        activeView === "editor" && "border-b"
      )}>
        <div className="flex bg-background/50 rounded-lg p-0.5 border">
          <Button
            variant={activeView === "editor" ? "secondary" : "ghost"}
            onClick={() => setActiveView("editor")}
            size="sm"
            className="h-7 text-xs font-normal"
          >
            Code
          </Button>
          <Button
            variant={activeView === "preview" ? "secondary" : "ghost"}
            onClick={() => setActiveView("preview")}
            size="sm"
            className="h-7 text-xs font-normal"
          >
            Preview
          </Button>
        </div>
        <div className="flex-1 flex justify-end items-center gap-2">
          {showImport && (
            <div
              onClick={() => setImportDialogOpen(true)}
            >
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5 font-normal">
                <FaGithub className="size-3.5" />
                Import
              </Button>
            </div>
          )}
          {(files?.length ?? 0) > 0 && <ExportPopover projectId={projectId} />}
        </div>
      </nav>
      <div className="flex-1 relative bg-background">
        <div className={cn(
          "absolute inset-0 bg-background",
          activeView === "editor" ? "z-10" : "z-0"
        )}>
          <Allotment defaultSizes={[DEFAULT_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE]}>
            <Allotment.Pane
              snap
              minSize={MIN_SIDEBAR_WIDTH}
              maxSize={MAX_SIDEBAR_WIDTH}
              preferredSize={DEFAULT_SIDEBAR_WIDTH}
            >
              <FileExplorer projectId={projectId} />
            </Allotment.Pane>
            <Allotment.Pane>
              <EditorView projectId={projectId} />
            </Allotment.Pane>
          </Allotment>
        </div>
        <div className={cn(
          "absolute inset-0 bg-background",
          activeView === "preview" ? "z-10" : "z-0"
        )}>
          <PreviewView projectId={projectId} />
        </div>
      </div>
    </div>
  );
};
