"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import { neobrutalism } from "@clerk/themes";

const Page = () => {
  

  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">

      <Image
        src="/zombie2.gif"
        alt="Random Image 2"
        width={400}
        height={400}
        className="fixed bottom-30 right-20 z-0"
      />
      <Image
        src="/shooter.gif"
        alt="Random Image 4"
        width={400}
        height={400}
        className="fixed bottom-30 left-10 z-0"
      />


      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          <SignIn
            appearance={{
              baseTheme: [neobrutalism],
              variables: { colorPrimary: "black" }
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default Page;
