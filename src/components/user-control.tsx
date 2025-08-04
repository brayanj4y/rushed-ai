"use client";

import { useCurrentTheme } from "@/hooks/use-theme";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

interface Props {
    showName?: boolean;
};


export const UserControl = ({ showName }: Props) => {
    const currenTheme = useCurrentTheme();


    return (
        <UserButton
            showName={showName}
            appearance={{
                baseTheme: currenTheme === "dark" ? dark : undefined,
            }}
        />
    );
};