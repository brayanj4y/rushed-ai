"use client";

import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
        </Link>




        <div className="flex items-center gap-4">
          <SignedOut>
            <div className="flex gap-2">
              <SignUpButton>
                <Button variant="outline" size="sm">
                  Sign up
                </Button>
              </SignUpButton>
              <SignInButton>
                <Button size="sm">Sign in</Button>
              </SignInButton>
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
