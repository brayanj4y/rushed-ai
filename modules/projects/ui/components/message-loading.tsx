import Image from "next/image"
import { useState, useEffect } from "react"


const ShimmerMessages = () => {
    const messages = [
        "Spinning up magic...",
        "cmd+N: New idea...",
        "Typing real fast...",
        "Hooking up hooks...",
        "Making it prettier...",
        "Squashing tiny bugs...",
        "UI looking cute...",
        "Alt+Shift+Wow...",
        "Almost there...",
    ];

    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
        }, 2000);

        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="flex intems-center gap-2">
            <span className="text-base text-muted-foreground animate-pulse">
                {messages[currentMessageIndex]}
            </span>
        </div>
    );
};

export const MessageLoading = () => {
    return (
        <div className="flex flex-col group px-2 pb-4">
            <div className="flex items-center gap-2 pl-2 mb-2">
                <Image
                    src="/logo.svg"
                    alt="Rushed"
                    width={18}
                    height={18}
                    className="shrink-0"
                />
                <span className="text-sm font-medium">Rushed</span>
            </div>
            <div className="pl-8.5 flex flex-col">
                <ShimmerMessages />
            </div>
        </div>
    );
};