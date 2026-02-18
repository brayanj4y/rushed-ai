import ky from "ky";
import { toast } from "sonner";
import { useState, useEffect, useRef, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Copy01Icon,
  Clock01Icon,
  Loading03Icon,
  PlusSignIcon,
  FileScriptIcon
} from "@hugeicons/core-free-icons";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputProvider,
  usePromptInputController,
  usePromptInputAttachments,
  PromptInputCommand,
  PromptInputCommandList,
  PromptInputCommandEmpty,
  PromptInputCommandGroup,
  PromptInputCommandItem,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";

import {
  useConversation,
  useConversations,
  useCreateConversation,
  useMessages,
} from "../hooks/use-conversations";
import { useFiles } from "@/features/projects/hooks/use-files";

import { Id } from "../../../../convex/_generated/dataModel";
import { DEFAULT_CONVERSATION_TITLE } from "../constants";
import { PastConversationsDialog } from "./past-conversations-dialog";

interface ConversationSidebarProps {
  projectId: Id<"projects">;
};

const MessageList = ({ messages }: { messages: any[] | undefined }) => {
  return (
    <Conversation className="flex-1">
      <ConversationContent>
        {messages?.map((message, messageIndex) => (
          <Message key={message._id} from={message.role}>
            <MessageContent>
              {message.status === "processing" ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    strokeWidth={2}
                    className="size-4 animate-spin"
                  />
                  <span>Thinking...</span>
                </div>
              ) : message.status === "cancelled" ? (
                <span className="text-muted-foreground italic">
                  Request cancelled
                </span>
              ) : (
                <MessageResponse>{message.content}</MessageResponse>
              )}
            </MessageContent>
            {message.role === "assistant" &&
              message.status === "completed" &&
              messageIndex === (messages?.length ?? 0) - 1 && (
                <MessageActions>
                  <MessageAction
                    onClick={() => {
                      navigator.clipboard.writeText(message.content);
                    }}
                    label="Copy"
                  >
                    <HugeiconsIcon
                      icon={Copy01Icon}
                      strokeWidth={2}
                      className="size-3"
                    />
                  </MessageAction>
                </MessageActions>
              )}
          </Message>
        ))}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
};

const MemoizedMessageList = React.memo(MessageList);

import React from "react";
const ConversationSidebarInner = ({
  projectId,
}: ConversationSidebarProps) => {
  const { textInput } = usePromptInputController();
  const [
    selectedConversationId,
    setSelectedConversationId,
  ] = useState<Id<"conversations"> | null>(null);
  const [
    pastConversationsOpen,
    setPastConversationsOpen
  ] = useState(false);

  // Mention state
  const [mentionState, setMentionState] = useState<{
    isOpen: boolean;
    filter: string;
    cursorPos: number;
  }>({
    isOpen: false,
    filter: "",
    cursorPos: 0,
  });

  const createConversation = useCreateConversation();
  const conversations = useConversations(projectId);
  const files = useFiles(projectId);

  const activeConversationId =
    selectedConversationId ?? conversations?.[0]?._id ?? null;

  const activeConversation = useConversation(activeConversationId);
  const conversationMessages = useMessages(activeConversationId);

  // Handle "Add to Chat" event from the editor
  useEffect(() => {
    const handleAdd = (e: any) => {
      const { text, fileName } = e.detail;
      const formattedText = `**@${fileName}**\n\`\`\`\n${text}\n\`\`\`\n`;
      textInput.setInput(textInput.value + (textInput.value ? "\n" : "") + formattedText);
    };

    window.addEventListener("rushed:add-to-chat" as any, handleAdd);
    return () => window.removeEventListener("rushed:add-to-chat" as any, handleAdd);
  }, [textInput]);

  // Handle detecting @ in the input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const selectionStart = e.target.selectionStart;

    // Look for @ before the cursor
    const textBeforeCursor = value.slice(0, selectionStart);
    const lastAtSign = textBeforeCursor.lastIndexOf("@");

    if (lastAtSign !== -1) {
      // Check if @ is at start or preceded by space/newline
      const charBeforeAt = lastAtSign > 0 ? textBeforeCursor[lastAtSign - 1] : "";
      const isStartOrSpace = !charBeforeAt || charBeforeAt === " " || charBeforeAt === "\n";

      if (isStartOrSpace) {
        const term = textBeforeCursor.slice(lastAtSign + 1);
        if (!term.includes(" ")) {
          setMentionState({
            isOpen: true,
            filter: term,
            cursorPos: selectionStart,
          });
          return;
        }
      }
    }

    if (mentionState.isOpen) {
      setMentionState(prev => ({ ...prev, isOpen: false }));
    }
  };

  const onSelectFile = (fileName: string) => {
    const value = textInput.value;
    const lastAtSign = value.slice(0, mentionState.cursorPos).lastIndexOf("@");

    if (lastAtSign !== -1) {
      const newValue =
        value.slice(0, lastAtSign) +
        `@${fileName} ` +
        value.slice(mentionState.cursorPos);

      textInput.setInput(newValue);
    }

    setMentionState(prev => ({ ...prev, isOpen: false }));
  };

  // Build path Map for files
  const filePaths = useMemo(() => {
    if (!files) return new Map<Id<"files">, string>();
    const fileMap = new Map(files.map(f => [f._id, f]));
    const paths = new Map<Id<"files">, string>();

    files.forEach(file => {
      const parts: string[] = [];
      let current = file;
      while (current) {
        parts.unshift(current.name);
        if (current.parentId && fileMap.has(current.parentId)) {
          current = fileMap.get(current.parentId)!;
        } else {
          break;
        }
      }
      paths.set(file._id, parts.join("/"));
    });

    return paths;
  }, [files]);

  const filteredFiles = useMemo(() => {
    if (!files) return [];
    return files
      .filter(f => f.type === "file")
      .map(f => ({
        ...f,
        path: filePaths.get(f._id) ?? f.name
      }))
      .filter(f =>
        f.path.toLowerCase().includes(mentionState.filter.toLowerCase())
      );
  }, [files, filePaths, mentionState.filter]);

  // Check if any message is currently processing
  const isProcessing = conversationMessages?.some(
    (msg) => msg.status === "processing"
  );

  const handleCancel = async () => {
    try {
      await ky.post("/api/messages/cancel", {
        json: { projectId },
      });
    } catch {
      toast.error("Unable to cancel request");
    }
  };

  const handleCreateConversation = async () => {
    try {
      const newConversationId = await createConversation({
        projectId,
        title: DEFAULT_CONVERSATION_TITLE,
      });
      setSelectedConversationId(newConversationId);
      return newConversationId;
    } catch {
      toast.error("Unable to create new conversation");
      return null;
    }
  };

  const handleSubmit = async (message: PromptInputMessage) => {
    // If processing and no new message, this is just a stop function
    if (isProcessing && !message.text) {
      await handleCancel()
      textInput.clear();
      return;
    }

    let conversationId = activeConversationId;

    if (!conversationId) {
      conversationId = await handleCreateConversation();
      if (!conversationId) {
        return;
      }
    }

    // Convert file attachments to markdown tags for the backend
    const fileTags = message.files
      .filter(f => f.type === "file") // Ensure we only tag files, not images if they are mixed
      .map(f => `**@${f.filename}**`)
      .join(" ");

    const fullMessage = fileTags
      ? `${fileTags}\n\n${message.text}`
      : message.text;

    // Trigger Inngest function via API
    try {
      // Clear input immediately for better UX
      textInput.clear();

      await ky.post("/api/messages", {
        json: {
          conversationId,
          message: fullMessage,
        },
      });
    } catch {
      toast.error("Message failed to send");
      // Optional: Restore text on failure
    }
  }

  return (
    <>
      <PastConversationsDialog
        projectId={projectId}
        open={pastConversationsOpen}
        onOpenChange={setPastConversationsOpen}
        onSelect={setSelectedConversationId}
      />
      <div className="flex flex-col h-full bg-sidebar rounded-xl border overflow-hidden">
        <div className="flex items-center justify-between border-b p-2">
          <div className="text-sm truncate pl-2 font-medium">
            {activeConversation?.title ?? DEFAULT_CONVERSATION_TITLE}
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon-xs"
              variant="ghost"
              className="size-6 hover:bg-background rounded-full"
              onClick={() => setPastConversationsOpen(true)}
              title="History"
            >
              <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="size-3.5" />
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              className="size-6 hover:bg-background rounded-full"
              onClick={handleCreateConversation}
              title="New Conversation"
            >
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-3.5" />
            </Button>
          </div>
        </div>
        <MemoizedMessageList messages={conversationMessages} />
        <div className="p-3 relative">
          <Popover open={mentionState.isOpen} onOpenChange={(open) => !open && setMentionState(prev => ({ ...prev, isOpen: false }))}>
            <PopoverAnchor asChild>
              <PromptInput
                onSubmit={handleSubmit}
                className="mt-2"
              >
                <PromptInputBody>
                  <PromptInputTextarea
                    placeholder="Ask Rushed whatever..."
                    disabled={isProcessing}
                    onChange={handleInputChange}
                  />
                </PromptInputBody>
                <PromptInputFooter>
                  <PromptInputTools />
                  <PromptInputSubmit
                    disabled={isProcessing ? false : !textInput.value}
                    status={isProcessing ? "streaming" : undefined}
                  />
                </PromptInputFooter>
              </PromptInput>
            </PopoverAnchor>
            <PopoverContent
              className="p-0 w-64 mb-2"
              side="top"
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <PromptInputCommand>
                <PromptInputCommandList className="max-h-64">
                  <PromptInputCommandEmpty>No files found.</PromptInputCommandEmpty>
                  <PromptInputCommandGroup heading="Tag File">
                    {filteredFiles.map(f => (
                      <PromptInputCommandItem
                        key={f._id}
                        onSelect={() => onSelectFile(f.path)}
                        className="flex items-center gap-2"
                      >
                        <HugeiconsIcon icon={FileScriptIcon} strokeWidth={2} className="size-4 opacity-70" />
                        <div className="flex flex-col min-w-0">
                          <span className="truncate font-medium">{f.name}</span>
                          <span className="truncate text-[10px] text-muted-foreground opacity-70">
                            {f.path}
                          </span>
                        </div>
                      </PromptInputCommandItem>
                    ))}
                  </PromptInputCommandGroup>
                </PromptInputCommandList>
              </PromptInputCommand>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
};

export const ConversationSidebar = (props: ConversationSidebarProps) => (
  <PromptInputProvider>
    <ConversationSidebarInner {...props} />
  </PromptInputProvider>
);
