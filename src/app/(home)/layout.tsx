import { Navbar } from "@/modules/home/ui/components/navbar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex flex-col min-h-screen max-h-screen relative">
      <Navbar />
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

      <div className="flex-1 flex flex-col px-4 pb-4">{children}</div>
    </main>
  );
};

export default Layout;
