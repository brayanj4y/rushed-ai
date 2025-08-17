"use client";

import { SignUp } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <div className="relative">
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-20 p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
      >
        <ArrowLeft className="w-6 h-6 text-black" />
      </button>

      <div className="relative flex w-full pt-15">
        <div className="flex-1 relative">

          <div className="relative z-10 flex flex-col justify-center items-center h-full px-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-black dark:text-black leading-none text-center break-words">
              <span className="block">WHAT IS</span>
              <span className="block">YOUR</span>
              <span className="block">NEXT</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">SAAS?</span>
            </h1>
          </div>
        </div>

        <div className="w-px bg-gray-300 dark:bg-gray-700 opacity-50 h-full"></div>

        <div className="flex-1 flex flex-col justify-center items-center px-8 bg-white dark:bg-gray-900">
          <SignUp
            appearance={{
              baseTheme: [neobrutalism],
              variables: { colorPrimary: "black" }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;