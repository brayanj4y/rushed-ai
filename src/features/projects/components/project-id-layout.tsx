"use client";

import { Allotment } from "allotment";
import { notFound } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { ConversationSidebar } from "@/features/conversations/components/conversation-sidebar";

import { Navbar } from "./navbar";
import { Id } from "../../../../convex/_generated/dataModel";

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_CONVERSATION_SIDEBAR_WIDTH = 400;
const DEFAULT_MAIN_SIZE = 1000;

export const ProjectIdLayout = ({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: Id<"projects">;
}) => {
  const project = useQuery(api.projects.getById, { id: projectId });

  if (project === null) {
    notFound();
  }

  return (
    <div className="w-full h-screen flex flex-col bg-sidebar">
      <Navbar projectId={projectId} />
      <div className="flex-1 flex overflow-hidden">
        <Allotment
          separator={false}
          className="flex-1"
          defaultSizes={[
            DEFAULT_CONVERSATION_SIDEBAR_WIDTH,
            DEFAULT_MAIN_SIZE
          ]}
        >
          <Allotment.Pane
            snap
            minSize={MIN_SIDEBAR_WIDTH}
            maxSize={MAX_SIDEBAR_WIDTH}
            preferredSize={DEFAULT_CONVERSATION_SIDEBAR_WIDTH}
          >
            <div className="h-full pl-2 pb-2 pr-1">
              <ConversationSidebar projectId={projectId} />
            </div>
          </Allotment.Pane>
          <Allotment.Pane>
            <div className="h-full pl-1 pb-2 pr-2">
              {children}
            </div>
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};
