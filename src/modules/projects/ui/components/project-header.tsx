import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { 
  ChevronDownIcon, 
  ArrowLeftIcon, 
  SunIcon,
  MoonIcon,
  MonitorIcon,
  SettingsIcon 
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

interface Props {
  projectId: string;
}

export const ProjectHeader = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId }),
  );

  const { setTheme, theme } = useTheme();

  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case 'light':
        return <SunIcon className="size-4" />;
      case 'dark':
        return <MoonIcon className="size-4" />;
      default:
        return <MonitorIcon className="size-4" />;
    }
  };

  const getCurrentThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      default:
        return 'System';
    }
  };

  return (
    <header className="px-4 py-3 flex justify-between items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="gap-2 h-10 px-3 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground transition-colors"
          >
            <Image 
              src="/logo.svg" 
              alt="Rushed" 
              width={24} 
              height={24}
              className="shrink-0" 
            />
            <span className="font-medium text-foreground truncate max-w-[200px]">
              {project.name}
            </span>
            <ChevronDownIcon className="size-4 text-muted-foreground shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56" 
          side="bottom" 
          align="start"
          sideOffset={4}
        >
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            <div className="font-medium text-foreground truncate">
              {project.name}
            </div>
            <div className="text-xs">
              Artifact Settings
            </div>
          </div>
          <DropdownMenuSeparator />
          
          
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeftIcon className="size-4 text-muted-foreground" />
              <span>Back to Home</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2 cursor-pointer">
              {getThemeIcon(theme || 'system')}
              <span>Theme</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {getCurrentThemeLabel()}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-40">
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem 
                    value="light" 
                    className="gap-2 cursor-pointer"
                  >
                    <SunIcon className="size-4" />
                    <span>Light</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem 
                    value="dark" 
                    className="gap-2 cursor-pointer"
                  >
                    <MoonIcon className="size-4" />
                    <span>Dark</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem 
                    value="system" 
                    className="gap-2 cursor-pointer"
                  >
                    <MonitorIcon className="size-4" />
                    <span>System</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <SettingsIcon className="size-4 text-muted-foreground" />
            <span>Artifact Settings</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};