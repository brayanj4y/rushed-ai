"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function Page() {
  const router = useRouter();

  return (
    <div className="relative">
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-20 p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
      >
        <ArrowLeft className="w-6 h-6 text-black" />
      </button>

      <div className="relative flex w-full pt-20">
        <div className="flex-1 flex flex-col justify-center items-center px-8 bg-white dark:bg-gray-900">
          <SignUp.Root>
            {/* Start step - collect email */}
            <SignUp.Step
              name="start"
              className="w-full space-y-6 rounded-2xl px-4 py-10 sm:w-96 sm:px-8"
            >
              <header className="text-center">
                <h1 className="mt-4 text-xl font-medium tracking-tight text-neutral-950">
                  Sign Up to Rushed
                </h1>
              </header>
              
              <Clerk.GlobalError className="block text-sm text-red-600" />
              
              <Clerk.Field name="emailAddress">
                <Clerk.Label className="sr-only">Email</Clerk.Label>
                <Clerk.Input
                  type="email"
                  required
                  placeholder="Email"
                  className="w-full border-b border-neutral-200 bg-white pb-2 text-sm/6 text-neutral-950 outline-none placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-600 data-[invalid]:border-red-600 data-[invalid]:text-red-600"
                />
                <Clerk.FieldError className="mt-2 block text-xs text-red-600" />
              </Clerk.Field>

              <SignUp.Captcha className="empty:hidden" />

              <SignUp.Action submit asChild>
                <Button className="w-full">Continue</Button>
              </SignUp.Action>

              <div className="rounded-xl bg-neutral-100 p-5">
                <p className="mb-4 text-center text-sm/5 text-neutral-500">
                  Alternatively, sign up with these platforms
                </p>
                <div className="space-y-2">
                  <Clerk.Connection name="google" asChild>
                    <Button variant="outline" className="w-full gap-3">
                      <FaGoogle className="w-4 h-4" />
                      Continue with Google
                    </Button>
                  </Clerk.Connection>
                  <Clerk.Connection name="github" asChild>
                    <Button variant="outline" className="w-full gap-3">
                      <FaGithub className="w-4 h-4" />
                      Continue with GitHub
                    </Button>
                  </Clerk.Connection>
                </div>
              </div>

              <p className="text-center text-sm text-neutral-500">
                Have an account?{" "}
                <Clerk.Link
                  navigate="sign-in"
                  className="rounded px-1 py-0.5 text-neutral-700 outline-none hover:bg-neutral-100 focus-visible:bg-neutral-100"
                >
                  Sign in
                </Clerk.Link>
              </p>
            </SignUp.Step>

            {/* Verifications step - email code */}
            <SignUp.Step
              name="verifications"
              className="w-full space-y-6 rounded-2xl px-4 py-10 sm:w-96 sm:px-8"
            >
              <SignUp.Strategy name="email_code">
                <header className="text-center">
                  <h1 className="mt-4 text-xl font-medium tracking-tight text-neutral-950">
                    Verify your email
                  </h1>
                  <p className="mt-2 text-sm text-neutral-500">
                    We sent a code to your email address
                  </p>
                </header>
                
                <Clerk.GlobalError className="block text-sm text-red-600" />
                
                <Clerk.Field name="code">
                  <Clerk.Label className="sr-only">Email verification code</Clerk.Label>
                  <Clerk.Input
                    type="otp"
                    required
                    placeholder="Enter verification code"
                    className="w-full border-b border-neutral-200 bg-white pb-2 text-sm/6 text-neutral-950 outline-none placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-600 data-[invalid]:border-red-600 data-[invalid]:text-red-600"
                  />
                  <Clerk.FieldError className="mt-2 block text-xs text-red-600" />
                </Clerk.Field>
                
                <SignUp.Action submit asChild>
                  <Button className="w-full">Verify Email</Button>
                </SignUp.Action>

                <SignUp.Action 
                  resend 
                  className="text-neutral-500 text-sm hover:text-neutral-700"
                  fallback={({ resendableAfter }: { resendableAfter: number }) => (
                    <p className="text-sm text-neutral-500">
                      Resend code in {resendableAfter} seconds
                    </p>
                  )}
                >
                  Didn&apos;t receive a code? Resend
                </SignUp.Action>
              </SignUp.Strategy>

              <p className="text-center text-sm text-neutral-500">
                Have an account?{" "}
                <Clerk.Link
                  navigate="sign-in"
                  className="rounded px-1 py-0.5 text-neutral-700 outline-none hover:bg-neutral-100 focus-visible:bg-neutral-100"
                >
                  Sign in
                </Clerk.Link>
              </p>
            </SignUp.Step>
          </SignUp.Root>
        </div>
      </div>
    </div>
  );
}