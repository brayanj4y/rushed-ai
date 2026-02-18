import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, ArrowRight01Icon, AlertCircleIcon, Globe02Icon, Loading03Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { formatDistanceToNow } from "date-fns";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { Kbd } from "@/components/ui/kbd";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Doc } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

import { useProjectsPartial } from "../hooks/use-projects";

const formatTimestamp = (timestamp: number) => {
  return formatDistanceToNow(new Date(timestamp), {
    addSuffix: true
  });
};

const getProjectIcon = (project: Doc<"projects">) => {
  if (project.importStatus === "completed") {
    return <HugeiconsIcon icon={GithubIcon} strokeWidth={2} className="size-3.5 text-muted-foreground" />
  }

  if (project.importStatus === "failed") {
    return <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-3.5 text-muted-foreground" />;
  }

  if (project.importStatus === "importing") {
    return (
      <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-3.5 text-muted-foreground animate-spin" />
    );
  }

  return <HugeiconsIcon icon={Globe02Icon} strokeWidth={2} className="size-3.5 text-muted-foreground" />;
}

interface ProjectsListProps {
  onViewAll: () => void;
}

export const ProjectActions = ({
  project,
  hideDelete = false
}: {
  project: Doc<"projects">;
  hideDelete?: boolean;
}) => {
  const deleteProject = useMutation(api.projects.deleteProject);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteProject({ id: project._id });
      toast.success("Project deleted");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              "{project.name}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {!hideDelete && (
        <Button
          variant="ghost"
          className="h-6 w-6 p-0 hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <HugeiconsIcon icon={Delete02Icon} className="size-4" />
          <span className="sr-only">Delete project</span>
        </Button>
      )}
    </>
  );
};

const ContinueCard = ({
  data
}: {
  data: Doc<"projects">;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Last updated
        </span>
        <ProjectActions project={data} />
      </div>
      <Button
        variant="outline"
        asChild
        className="h-auto items-start justify-start p-4 bg-background border rounded-xl flex flex-col gap-2 w-full"
      >
        <Link href={`/projects/${data._id}`} className="group">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {getProjectIcon(data)}
              <span className="font-medium truncate">
                {data.name}
              </span>
            </div>
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(data.updatedAt)}
          </span>
        </Link>
      </Button>
    </div>
  )
};

const ProjectItem = ({
  data
}: {
  data: Doc<"projects">;
}) => {
  return (
    <div className="group relative flex items-center justify-between w-full hover:bg-accent/50 rounded-lg pr-2 transition-colors h-8">
      <Link
        href={`/projects/${data._id}`}
        className="text-sm text-foreground/60 font-medium hover:text-foreground py-1.5 pl-2 flex items-center gap-2 flex-1 min-w-0"
      >
        {getProjectIcon(data)}
        <span className="truncate">{data.name}</span>
      </Link>
      <div className="hidden group-hover:flex items-center gap-2">
        <ProjectActions project={data} />
      </div>
      <div className="flex group-hover:hidden items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {formatTimestamp(data.updatedAt)}
        </span>
      </div>
    </div>
  );
};

export const ProjectsListSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">
          Last updated
        </span>
        <div className="h-[84px] items-start justify-start p-4 bg-background border rounded-xl flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 w-full">
              <Skeleton className="size-3.5 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="size-3 rounded shadow-none" />
          </div>
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            Recent projects
          </span>
          <div className="flex items-center gap-2 opacity-50">
            <span className="text-xs text-muted-foreground">View all</span>
            <Kbd className="bg-accent border opacity-50">
              ⌘K
            </Kbd>
          </div>
        </div>
        <ul className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="py-1 flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2 w-full">
                <Skeleton className="size-3.5 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const ProjectsList = ({
  onViewAll
}: ProjectsListProps) => {
  const projects = useProjectsPartial(6);

  if (projects === undefined) {
    return <ProjectsListSkeleton />
  }

  const [mostRecent, ...rest] = projects;

  return (
    <div className="flex flex-col gap-4">
      {mostRecent ? <ContinueCard data={mostRecent} /> : null}
      {rest.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              Recent projects
            </span>
            <button
              onClick={onViewAll}
              className="flex items-center gap-2 text-muted-foreground text-xs hover:text-foreground transition-colors"
            >
              <span>View all</span>
              <Kbd className="bg-accent border">
                ⌘K
              </Kbd>
            </button>
          </div>
          <ul className="flex flex-col">
            {rest.map((project) => (
              <ProjectItem
                key={project._id}
                data={project}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
};
