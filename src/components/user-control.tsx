"use client";

import { useCurrentTheme } from "@/hooks/theme";
import { UserButton } from "@clerk/nextjs";
import { dark,} from "@clerk/themes";

interface Props {
  showName?: boolean;
}

export const UserControl = ({ showName }: Props) => {
  const currentTheme = useCurrentTheme();

  return (
    <UserButton
      showName={showName}
      appearance={{
        baseTheme: currentTheme === "dark" ? dark : undefined,
      }}
    />
  );
};
