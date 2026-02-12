import { HugeiconsIcon } from "@hugeicons/react"
import { Loading02Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  const { strokeWidth, ...otherProps } = props as any;
  return (
    <HugeiconsIcon
      icon={Loading02Icon}
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...otherProps}
    />
  )
}

export { Spinner }
