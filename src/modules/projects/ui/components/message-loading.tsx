import Image from "next/image";
import { useEffect, useState } from "react";

const ShimmerMessages = () => {
  const messages = [
    "🧠 Cooking up some genius...",
    "🌀 Spinning the wheels of creativity...",
    "✨ Magic in progress..."
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex items-center gap-2">
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
          src="/logo.gif"
          alt="Rushed"
          width={30}
          height={30}
          className="shrink-0"
        />
        <span className="text-sm font-medium">Rushed</span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-4">
        <ShimmerMessages />
      </div>
    </div>
  );
};
