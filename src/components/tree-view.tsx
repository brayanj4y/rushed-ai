import { TreeItem } from "@/types";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
  SidebarRail,
} from "./ui/sidebar";
import { ChevronRightIcon, FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TreeViewProps {
  data: TreeItem[];
  value?: string | null;
  onSelect?: (value: string) => void;
}

export const TreeView = ({ data, value, onSelect }: TreeViewProps) => {
  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="w-full">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.map((item, index) => (
                  <Tree
                    key={index}
                    item={item}
                    selectedValue={value}
                    onSelect={onSelect}
                    parentPath=""
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
};

interface TreeProps {
  item: TreeItem;
  selectedValue?: string | null;
  onSelect?: (value: string) => void;
  parentPath: string;
}

const Tree = ({ item, selectedValue, onSelect, parentPath }: TreeProps) => {
  const [name, ...items] = Array.isArray(item) ? item : [item];
  const currentPath = parentPath ? `${parentPath}/${name}` : name;
  const [isOpen, setIsOpen] = useState(true);

  if (!items.length) {
    // It's a file
    const isSelected = selectedValue === currentPath;

    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isSelected}
          className={cn(
            "transition-colors duration-200",
            isSelected && [
              "bg-accent text-accent-foreground",
              "hover:bg-accent hover:text-accent-foreground"
            ]
          )}
          onClick={() => onSelect?.(currentPath)}
        >
          <FileIcon className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">{name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // It's a folder
  return (
    <SidebarMenuItem>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton 
            className="hover:bg-accent/50 transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            <ChevronRightIcon 
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen && "rotate-90"
              )} 
            />
            {isOpen ? (
              <FolderOpenIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <FolderIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            )}
            <span className="truncate font-medium">{name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="transition-all duration-200">
          <SidebarMenuSub className="ml-4 border-l border-border/50 pl-2">
            {items.map((subItem, index) => (
              <Tree
                key={index}
                item={subItem}
                selectedValue={selectedValue}
                onSelect={onSelect}
                parentPath={currentPath}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};