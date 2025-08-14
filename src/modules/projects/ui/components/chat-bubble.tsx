import React from 'react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
    children: React.ReactNode;
    variant?: 'sent' | 'received';
    className?: string;
    showTail?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
    children,
    variant = 'sent',
    className,
    showTail = true
}) => {
    const isSent = variant === 'sent';

    return (
        <div className={cn(
            "flex pb-4",
            isSent ? "justify-end pr-2 pl-10" : "justify-start pl-2 pr-10",
            className
        )}>
            <div
                className={cn(
                    "relative rounded-2xl p-3 max-w-[80%] break-words",
                    isSent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                    showTail && (isSent ? "rounded-tr-none" : "rounded-tl-none")
                )}
            >
                {children}

                {/* Message tail */}
                {showTail && (
                    <>
                        <div
                            className={cn(
                                "absolute top-0 w-5 h-6",
                                isSent
                                    ? "right-[-7px] bg-primary"
                                    : "left-[-7px] bg-muted"
                            )}
                            style={{
                                borderTopLeftRadius: isSent ? '16px 14px' : '0',
                                borderTopRightRadius: isSent ? '0' : '16px 14px',
                            }}
                        />
                        <div
                            className={cn(
                                "absolute top-0 w-[26px] h-6 bg-background",
                                isSent ? "right-[-26px]" : "left-[-26px]"
                            )}
                            style={{
                                borderTopLeftRadius: isSent ? '10px' : '0',
                                borderTopRightRadius: isSent ? '0' : '10px',
                            }}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatBubble;

/* 
Usage Examples:

// For a sent message (blue bubble on the right)
<ChatBubble variant="sent">
  Hey! How are you doing today?
</ChatBubble>

// For a received message (gray bubble on the left)
<ChatBubble variant="received">
  I'm doing great, thanks for asking!
</ChatBubble>

// Without tail (for consecutive messages from same sender)
<ChatBubble variant="sent" showTail={false}>
  This is a follow-up message
</ChatBubble>

// With custom className for additional styling
<ChatBubble variant="sent" className="mt-2">
  {content}
</ChatBubble>

// With rich content
<ChatBubble variant="sent">
  <div>
    <p className="font-bold">Title</p>
    <p>Message content here</p>
  </div>
</ChatBubble>
*/

/* 
Alternative Tailwind-only version (if you prefer inline classes):

export const ChatBubbleTailwind: React.FC<ChatBubbleProps> = ({ 
  children, 
  variant = 'sent',
  className,
  showTail = true 
}) => {
  const isSent = variant === 'sent';
  
  return (
    <div className={`flex pb-4 ${isSent ? 'justify-end pr-2 pl-10' : 'justify-start pl-2 pr-10'} ${className || ''}`}>
      <div className={`relative rounded-2xl p-3 max-w-[80%] break-words ${
        isSent 
          ? 'bg-blue-500 text-white rounded-br-sm' 
          : 'bg-gray-200 text-gray-900 rounded-bl-sm'
      }`}>
        {children}
        
        {showTail && (
          <>
            <style jsx>{`
              .bubble-tail-sent::before {
                content: "";
                position: absolute;
                bottom: 0;
                right: -7px;
                width: 20px;
                height: 25px;
                background-color: rgb(59 130 246);
                border-bottom-left-radius: 16px 14px;
              }
              .bubble-tail-sent::after {
                content: "";
                position: absolute;
                bottom: 0;
                right: -26px;
                width: 26px;
                height: 25px;
                background-color: white;
                border-bottom-left-radius: 10px;
              }
              .bubble-tail-received::before {
                content: "";
                position: absolute;
                bottom: 0;
                left: -7px;
                width: 20px;
                height: 25px;
                background-color: rgb(229 231 235);
                border-bottom-right-radius: 16px 14px;
              }
              .bubble-tail-received::after {
                content: "";
                position: absolute;
                bottom: 0;
                left: -26px;
                width: 26px;
                height: 25px;
                background-color: white;
                border-bottom-right-radius: 10px;
              }
            `}</style>
            <div className={isSent ? 'bubble-tail-sent' : 'bubble-tail-received'} />
          </>
        )}
      </div>
    </div>
  );
};
*/