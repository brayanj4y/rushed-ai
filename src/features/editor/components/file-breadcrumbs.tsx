import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { File02Icon } from "@hugeicons/core-free-icons";

import { useFilePath } from "@/features/projects/hooks/use-files";
import { useEditor } from "@/features/editor/hooks/use-editor"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Id } from "../../../../convex/_generated/dataModel";

export const FileBreadcrumbs = ({
  projectId,
}: {
  projectId: Id<"projects">;
}) => {
  const { activeTabId } = useEditor(projectId);
  const filePath = useFilePath(activeTabId);

  if (filePath === undefined || !activeTabId) {
    return (
      <div className="p-2 bg-background pl-4 border-b">
        <Breadcrumb>
          <BreadcrumbList className="sm:gap-0.5 gap-0.5">
            <BreadcrumbItem className="text-sm">
              <BreadcrumbPage>&nbsp;</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    );
  }

  return (
    <div className="p-2 bg-background pl-4 border-b">
      <Breadcrumb>
        <BreadcrumbList className="sm:gap-0.5 gap-0.5">
          {filePath.map((item, index) => {
            const isLast = index === filePath.length - 1;

            return (
              <React.Fragment key={item._id}>
                <BreadcrumbItem className="text-sm">
                  {isLast ? (
                    <BreadcrumbPage className="flex items-center gap-1">
                      <HugeiconsIcon
                        icon={File02Icon}
                        strokeWidth={2}
                        className="size-4 text-muted-foreground"
                      />
                      {item.name}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href="#">
                      {item.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
