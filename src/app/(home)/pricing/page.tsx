"use client";

import { PricingTable } from "@clerk/nextjs";

const Page = () => {

  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <h1 className="text-4xl md:text-5xl font-bold text-center">Packs</h1>
        <p className="text-muted-foreground text-center text-base md:text-lg">
          CLock in the plan that’s made for you 🔒
        </p>
        <PricingTable
      appearance={{  
        variables: {
          colorPrimary: 'black'
        }
      }}
        />
      </section>
    </div>
  );
};

export default Page;