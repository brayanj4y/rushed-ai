import { Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const GithubStarButton = () => {
    return (
        <Link
            href="https://github.com/brayanj4y/rushed-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
        >
            <Badge
                variant="outline"
                className="flex items-center gap-2 px-3 py-1 bg-white hover:bg-gray-50 border-gray-200 text-gray-900 rounded-full transition-all dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-100 shadow-sm"
            >
                <Star className="size-3.5 fill-yellow-400 text-yellow-500" />
                <span className="text-xs font-semibold">Star on GitHub</span>
            </Badge>
        </Link>
    );
};
