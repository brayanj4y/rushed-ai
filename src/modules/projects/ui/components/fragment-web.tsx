import { useState } from "react";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";

import { Fragment } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";

interface Props {
    data: Fragment
};

export function FragmentWeb({ data }: Props) {
    const [FragmentKey, setFragmentkey] = useState(0);
    const [copied, setCopied] = useState(false);

    const onRefresh = () => {
        setFragmentkey((prev) => prev + 1);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(data.sandboxUrl);
        setCopied(true);
        setTimeout(() => (false), 2000);
    };

    return (
        <div className="flex flex-col w-full h-full">
            <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
                <Hint text="just a refresher..." side="bottom" align="start">
                <Button size="sm" variant="outline" onClick={onRefresh}>
                    <RefreshCcwIcon />
                </Button>
                </Hint>
                <Hint text="tap to copy!" side="bottom">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    disabled={!data.sandboxUrl || copied}
                    className="flex-1 justify-start text-start font-normal"
                >
                    <span className="truncate">
                        {data.sandboxUrl}
                    </span>
                </Button>
                </Hint>
                <Hint text="open in a new tab dawg..." side="bottom" align="start">
                <Button
                    size="sm"
                    disabled={!data.sandboxUrl}
                    variant="outline"
                    onClick={() => {
                        if (!data.sandboxUrl) return;
                        window.open(data.sandboxUrl, "_blank");
                    }}
                >
                    <ExternalLinkIcon className="w-4 h-4" />
                </Button>
                </Hint>
            </div>
            <iframe
                key={FragmentKey}
                className="h-full w-full"
                sandbox="allow-forms allow-scripts allow-same-origin"
                loading="lazy"
                src={data.sandboxUrl}
            />
        </div>
    )
}