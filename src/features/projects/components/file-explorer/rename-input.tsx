import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { File02Icon, Folder01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { getItemPadding } from "./constants";
import { cn } from "@/lib/utils";

export const RenameInput = ({
  type,
  defaultValue,
  isOpen,
  level,
  onSubmit,
  onCancel
}: {
  type: "file" | "folder",
  defaultValue: string;
  isOpen?: boolean;
  level: number,
  onSubmit: (name: string) => void;
  onCancel: () => void;
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = () => {
    const trimmedValue = value.trim() || defaultValue;
    onSubmit(trimmedValue);
  }

  return (
    <div className="w-full flex items-center gap-1 h-5.5 bg-accent/30"
      style={{ paddingLeft: getItemPadding(level, type === "file") }}
    >
      <div className="flex items-center gap-0.5">
        {type === "folder" && (
          <HugeiconsIcon icon={ArrowRight01Icon} className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-90",
          )} strokeWidth={2} />
        )}
        {type === "file" && (
          <HugeiconsIcon icon={File02Icon} strokeWidth={2} className="size-4 text-muted-foreground" />
        )}
        {type === "folder" && (
          <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} className="size-4 text-muted-foreground" />
        )}
      </div>
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 bg-transparent text-sm outline-none focus:ring-1 focus:ring-inset focus:ring-ring"
        onBlur={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
          if (e.key === "Escape") {
            onCancel();
          }
        }}
        onFocus={(e) => {
          if (type === "folder") {
            e.currentTarget.select();
          } else {
            const value = e.currentTarget.value;
            const lastDotIndex = value.lastIndexOf(".");
            if (lastDotIndex > 0) {
              e.currentTarget.setSelectionRange(0, lastDotIndex);
            } else {
              e.currentTarget.select();
            }
          }
        }}
      />
    </div>
  );
};
