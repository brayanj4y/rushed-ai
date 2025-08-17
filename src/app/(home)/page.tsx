import { Navbar } from "@/modules/home/ui/components/navbar";
import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ProjectsList } from "@/modules/home/ui/components/projects-list";
import Image from "next/image";

export default function Page() {
  return (
    <div className="relative min-h-screen">
      <Navbar/>
      <div
        className="fixed inset-0 -z-10 
          bg-white dark:bg-black 
          bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
          dark:bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)]
          bg-[size:6rem_4rem]"
      >
        <div
          className="absolute inset-0 
            bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)] 
            dark:bg-[radial-gradient(circle_500px_at_50%_200px,#1d2b53,transparent)]"
        />
      </div>

      <div className="flex flex-col max-w-5xl mx-auto w-full">
        <section className="space-y-6 py-[16vh] 2xl:py-48">
          <div className="flex flex-col items-center">
            <Image
              src="/logo.gif"
              alt="Rushed"
              width={90}
              height={90}
              className="hidden md:block"
            />
          </div>
          <h1 className="text-2xl md:text-5xl font-bold text-center">
            Build lit with Rushed — your AI hype squad for coding
          </h1>
          <p className="text-lg md:text-muted-foreground text-center">
            Chat your way to apps and sites, no sweat ⚡.
          </p>
          <div className="max-w-3xl mx-auto w-full">
            <ProjectForm />
          </div>
        </section>
        <ProjectsList />
      </div>
    </div>
  );
}