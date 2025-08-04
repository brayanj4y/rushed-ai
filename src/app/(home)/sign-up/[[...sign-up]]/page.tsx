"use client";

import { useCurrentTheme } from "@/hooks/use-theme";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const Page = () => {
    const currenTheme = useCurrentTheme();
    return (
        <div className="flex flex-col max-w-3xl mx-auto w-full">
            <section className="space-y-6 pt-[16vh] 2xl:pt-48">
                <div className="flex flex-col items-center">
                    <SignUp
                    appearance={{
                        baseTheme: currenTheme === "dark" ? dark : undefined,
                    }}
                     />
                </div>
            </section>
        </div>
    );
}

export default Page;