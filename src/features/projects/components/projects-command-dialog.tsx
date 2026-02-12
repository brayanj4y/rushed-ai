import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, Globe02Icon, Loading02Icon, GithubIcon } from "@hugeicons/core-free-icons";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useProjects } from "../hooks/use-projects";
import { Doc } from "../../../../convex/_generated/dataModel";

interface ProjectsCommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const getProjectIcon = (project: Doc<"projects">) => {
  if (project.importStatus === "completed") {
    return <HugeiconsIcon icon={GithubIcon} className="size-4 text-muted-foreground" />
  }

  if (project.importStatus === "failed") {
    return <HugeiconsIcon icon={AlertCircleIcon} className="size-4 text-muted-foreground" />;
  }

  if (project.importStatus === "importing") {
    return (
      <HugeiconsIcon icon={Loading02Icon} className="size-4 text-muted-foreground animate-spin" />
    );
  }

  return <HugeiconsIcon icon={Globe02Icon} className="size-4 text-muted-foreground" />;
}

export const ProjectsCommandDialog = ({
  open,
  onOpenChange,
}: ProjectsCommandDialogProps) => {
  const router = useRouter();
  const projects = useProjects();

  const handleSelect = (projectId: string) => {
    router.push(`/projects/${projectId}`);
    onOpenChange(false);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search Projects"
      description="Search and navigate to your projects"
    >
      <CommandInput placeholder="Find your stuff..." />
      <CommandList>
        <CommandEmpty>No projects found.</CommandEmpty>
        <CommandGroup heading="Projects">
          {projects?.map((project) => (
            <CommandItem
              key={project._id}
              value={`${project.name}-${project._id}`}
              onSelect={() => handleSelect(project._id)}
            >
              {getProjectIcon(project)}
              <span>{project.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
};