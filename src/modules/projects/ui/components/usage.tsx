import { Button } from "@/components/ui/button";
import { Gem } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  points: number;
  msBeforeNext: number;
}

export default function Usage({ points }: Props) {
  return (
    <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center gap-x-2">
        <div className="flex items-center gap-2">
          <Gem className="size-4 text-purple-500" />
          <p className="text-sm">
            <span className="font-semibold">{points}</span> gems remaining
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="ml-auto">
          <Link href="/pricing" className="flex items-center gap-2">
            <Image
              src="/coin.jpeg"
              alt="Coin"
              width={20}
              height={20}
              className="rounded-full"
            />
            Buy Gems
          </Link>
        </Button>
      </div>
    </div>
  );
}
