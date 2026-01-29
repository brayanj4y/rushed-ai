"use client";

import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import {
  SignedIn,
  SignedOut,
  SignUpButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export const Navbar = () => {
  const isScrolled = useScroll();
  const [gemsRemaining, setGemsRemaining] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/usage")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.remainingPoints !== undefined) {
          setGemsRemaining(data.remainingPoints);
        }
      })
      .catch(() => { });
  }, []);

  return (
    <nav
      className={cn(
        `p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent`,
        isScrolled && "bg-background border-border"
      )}
    >
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center">

        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Rushed" width={32} height={32} />
          <span className="font-semibold text-lg">Rushed</span>
          <span className="ml-1 px-1.5 py-[1px] text-[10px] font-medium rounded bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">
            Development
          </span>
        </Link>





        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/brayanj4y/rushed-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <Star className="size-4 fill-yellow-400 text-yellow-500" />
              Star on GitHub
            </Button>
          </Link>
          <SignedOut>
            <div className="flex gap-2">
              <SignUpButton>
                <Button variant="outline" size="sm">
                  Join the Waitlist
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            {gemsRemaining !== null && (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                <Image
                  src="/coin.jpeg"
                  alt="Coin"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span>{gemsRemaining} Gems left</span>
              </div>
            )}

            <UserControl />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};
