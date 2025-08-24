import UpgradeButton from "@/components/upgrade_button";
import { useAuth } from "@clerk/nextjs";
import { formatDuration, intervalToDuration } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface Props {
  points: number;
  msBeforeNext: number;
}

export default function Usage({ points, msBeforeNext }: Props) {
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "turbo" });

  return (
    <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">
            {points} {hasProAccess ? "" : "free"} Gems remaining
          </p>
          <p className="text-xs text-muted-foreground">
            Resets in{" "}
            {formatDuration(
              intervalToDuration({
                start: new Date(),
                end: new Date(Date.now() + msBeforeNext),
              }),
              { format: ["months", "days", "hours"] },
            )}
          </p>
        </div>
        {!hasProAccess && (
          <UpgradeButton asChild className="ml-auto">
            <Link href="/pricing" className="flex items-center gap-2">
            </Link>
          </UpgradeButton>
        )}
      </div>
    </div>
  );
}
