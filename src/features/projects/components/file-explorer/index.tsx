import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, Copy01Icon, FileAddIcon, FolderAddIcon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import { useProject } from "../../hooks/use-projects"
import { Id } from "../../../../../convex/_generated/dataModel"
import {
  useCreateFile,
  useCreateFolder,
  useFolderContents
} from "../../hooks/use-files"
import { CreateInput } from "./create-input"
import { LoadingRow } from "./loading-row"
import { Tree } from "./tree"

export const FileExplorer = ({
  projectId
}: {
  projectId: Id<"projects">
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [collapseKey, setCollapseKey] = useState(0);
  const [creating, setCreating] = useState<"file" | "folder" | null>(
    null
  );

  const project = useProject(projectId);
  const rootFiles = useFolderContents({
    projectId,
    enabled: isOpen,
  });

  const createFile = useCreateFile();
  const createFolder = useCreateFolder();
  const handleCreate = (name: string) => {
    setCreating(null);

    if (creating === "file") {
      createFile({
        projectId,
        name,
        content: "",
        parentId: undefined,
      });
    } else {
      createFolder({
        projectId,
        name,
        parentId: undefined,
      });
    }
  };

  return (
    <div className="h-full bg-sidebar flex flex-col">
      <div
        role="button"
        onClick={() => setIsOpen((value) => !value)}
        className="group/project cursor-pointer w-full text-left flex items-center gap-0.5 h-8 bg-accent font-bold pr-4 shrink-0 transition-colors"
      >
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            isOpen && "rotate-90"
          )}
          strokeWidth={2}
        />
        <p className="text-xs uppercase line-clamp-1">
          {project?.name ?? "Loading..."}
        </p>
        <div className="flex items-center gap-0.5 ml-auto">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsOpen(true);
              setCreating("file");
            }}
            variant="highlight"
            size="icon-xs"
          >
            <HugeiconsIcon icon={FileAddIcon} strokeWidth={2} className="size-3.5" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsOpen(true);
              setCreating("folder");
            }}
            variant="highlight"
            size="icon-xs"
          >
            <HugeiconsIcon icon={FolderAddIcon} strokeWidth={2} className="size-3.5" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setCollapseKey((prev) => prev + 1);
            }}
            variant="highlight"
            size="icon-xs"
          >
            <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3.5" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        {isOpen && (
          <>
            {rootFiles === undefined && <LoadingRow level={0} />}
            {creating && (
              <CreateInput
                type={creating}
                level={0}
                onSubmit={handleCreate}
                onCancel={() => setCreating(null)}
              />
            )}
            {rootFiles?.map((item) => (
              <Tree
                key={`${item._id}-${collapseKey}`}
                item={item}
                level={0}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </ScrollArea>
    </div>
  )
}