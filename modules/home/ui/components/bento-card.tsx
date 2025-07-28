import Image from "next/image";
import { cn } from "@/lib/utils";

interface PixelBentoCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageSrc?: string;
  colSpan?: string;
  rowSpan?: string;
  className?: string;
}

export function PixelBentoCard({
  title,
  subtitle,
  description,
  imageSrc,
  colSpan = "col-span-1",
  rowSpan = "row-span-1",
  className,
}: PixelBentoCardProps) {
  return (
    <div
      className={cn(
        "relative p-4 border border-border shadow-3d-sm bg-card overflow-hidden transition-all hover:scale-[1.01]",
        "flex flex-col justify-between",
        colSpan,
        rowSpan,
        className,
        "rounded-xl"
      )}
      style={{
        imageRendering: "pixelated",
      }}
    >
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="absolute inset-0 object-cover image-pixelated z-0"
        />
      )}

      {imageSrc && (
        <div className="absolute inset-0 bg-black/10 z-10" />
      )}

      <div className="relative z-20">
        <h3 className="font-bold text-sm">{title}</h3>
        {<p className="text-xs mt-1">{subtitle}</p>}
        {<p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
