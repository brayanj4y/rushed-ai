"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import { neobrutalism } from "@clerk/themes";

const Page = () => {
  return (
    <div className="relative ">
   
      <div className="relative flex w-full pt-17">
    
        <div className="flex-1 flex flex-col justify-center items-center px-8">
          <SignIn
            appearance={{
              baseTheme: [neobrutalism],
              variables: { colorPrimary: "black" }
            }}
          />
        </div>

       
        <div className="w-px bg-gray-300 dark:bg-gray-700 opacity-50"></div>

      
        <div className="flex-1 flex flex-col justify-center items-center px-8 space-y-8">
          
          <div className="flex justify-center">
            <Image
              src="/zombie2.gif"
              alt="Random Image 2"
              width={350}
              height={350}
              className="rounded-lg"
            />
          </div>

      
          <div className="w-full max-w-md space-y-6">
            <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
              What Our Users Say
            </h3>
            
            <div className="space-y-4">


              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                  "Game-changer for our team productivity. Highly recommended!"
                </p>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  - Emma Davis
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;