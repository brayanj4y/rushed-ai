"use client";

import { PricingTable } from "@clerk/nextjs";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { dark } from "@clerk/themes";

const Page = () => {
  const currentTheme = useCurrentTheme();

  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <h1 className="text-4xl md:text-5xl font-bold text-center">Pricing</h1>
        <p className="text-muted-foreground text-center text-base md:text-lg">
          CLock in the plan that’s made for you 🔒
        </p>
        <PricingTable
          appearance={{
            baseTheme: currentTheme === "dark" ? dark : undefined,
          }}
        />
      </section>
    </div>
  );
};

export default Page;