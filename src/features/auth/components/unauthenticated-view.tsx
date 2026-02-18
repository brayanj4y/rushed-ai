import { HugeiconsIcon } from "@hugeicons/react";
import { Shield02Icon } from "@hugeicons/core-free-icons";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export const UnauthenticatedView = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background p-4">
      <div className="w-full max-w-lg bg-muted rounded-xl border border-border overflow-hidden">
        <Item variant="default" className="border-none!">
          <ItemMedia variant="icon" className="rounded-md">
            <HugeiconsIcon icon={Shield02Icon} className="size-4" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Unauthorized Access</ItemTitle>
            <ItemDescription>
              You are not authorized to access this resource.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <SignInButton>
              <Button variant="outline" size="sm" className="rounded-lg">
                Sign in
              </Button>
            </SignInButton>
          </ItemActions>
        </Item>
      </div>
    </div>
  );
};
