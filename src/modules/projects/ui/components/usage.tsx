import { Button } from "@/components/ui/button";
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
    <div className="relative">
      <div 
        className="bg-background border border-b-0 p-2.5"
        style={{
          borderTopLeftRadius: '0.75rem',
          borderTopRightRadius: '0.75rem',
          borderBottomLeftRadius: '0 0 0.75rem 0.75rem',
          borderBottomRightRadius: '0 0 0.75rem 0.75rem'
        }}
      >
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
            <Button asChild size="sm" variant={"tertiary"} className="ml-auto">
              <Link href="/pricing" className="flex items-center gap-2">
                <Image
                  src="/upgrade-icon.png"
                  alt="Upgrade"
                  width={20}
                  height={20}
                />
                Upgrade
              </Link>
            </Button>
          )}
        </div>
      </div>
      {/* Bottom inward curve */}
      <div 
        className="h-3 bg-background border-l border-r border-b mx-px"
        style={{
          borderRadius: '0 0 0.75rem 0.75rem',
          marginTop: '-1px'
        }}
      />
    </div>
  );
}