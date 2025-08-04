import Image from "next/image";
import { ProjectForm } from "../../modules/home/ui/components/project-form";
import { PixelBentoCard } from "../../modules/home/ui/components/bento-card";

const Page = () => {
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full px-4">
      <section className="flex flex-col items-center space-y-8 py-[12vh] 2xl:py-40">

        <Image
          src="/logo.gif"
          alt="Rushed"
          width={90}
          height={90}
          className="hidden md:block mt-12"
        />


        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-6xl font-bold tracking-tight">
            Vibin’ code—no rush, just flow...
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-xl mx-auto">
            Craft cool apps, websites — powered by AI! 🚀
          </p>
        </div>

        <div className="w-full max-w-3xl">
          <ProjectForm />
        </div>

        <div className="text-center pt-16">
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">
            Ok, why me over ur exes...
          </h2>
        </div>

        <div className="grid gap-4 mt-10 grid-cols-4 auto-rows-[150px] md:auto-rows-[180px] w-full">
          <PixelBentoCard
            title="Yap to Build"
            subtitle="🧠 AI That Gets You"
            description="Just type what you want — it listens, plans, and builds the app for you. Seriously."
            colSpan="col-span-2"
          />

          <PixelBentoCard
            title="Launch in Minutes"
            subtitle="⚡ No Code, No Delay"
            description="Skip the dev backlog. Get from idea to working app in one smooth convo."
            imageSrc=""
            colSpan="col-span-2"
            rowSpan="row-span-2"
          />

          <PixelBentoCard
            title="UI? Done."
            subtitle="🎨 Looks Good Already"
            description="No fiddling with components. Your AI co-dev handles the UI like a pro."
            imageSrc=""
            colSpan="col-span-2"
            rowSpan="row-span-2"
          />

          <PixelBentoCard
            title="Custom Logic"
            subtitle="🧩 Smarter Than a Template"
            description="Need conditions, actions, or flows? Just say it — we’ll wire it up."
            colSpan="col-span-1"
          />

          <PixelBentoCard
            title="Safe & Sound"
            subtitle="🔒 MVP-Ready Security"
            description="Your ideas stay private, and your app won’t fall apart. That’s a promise."
            colSpan="col-span-1"
          />

        </div>
      </section>
    </div>
  );
};

export default Page;
