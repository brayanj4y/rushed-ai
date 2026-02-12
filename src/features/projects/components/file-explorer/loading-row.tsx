import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

import { getItemPadding } from "./constants";

export const LoadingRow = ({
  className,
  level = 0,
}: {
  className?: string;
  level?: number;
}) => {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-5.5 flex items-center text-muted-foreground gap-1 w-full",
            className,
          )}
          style={{ paddingLeft: getItemPadding(level, false) }}
        >
          <Skeleton className="size-3.5 rounded-sm shrink-0" />
          <Skeleton className="h-3 w-24 rounded-sm" />
        </div>
      ))}
    </>
  );
};
