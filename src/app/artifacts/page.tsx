"use client";

import { useRouter } from "next/navigation";
import { ProjectLists } from "../../modules/home/ui/components/projects-list";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export default function ArtifactsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </Button>

        <h1 className="text-[68px] font-semibold text-foreground">Artifacts</h1>

        <ProjectLists />
      </div>
    </div>
  );
}
