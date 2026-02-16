import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-background">
            <div className="space-y-2 text-center">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="text-muted-foreground">Page not found</p>
            </div>
            <Button asChild>
                <Link href="/">
                    Return Home
                </Link>
            </Button>
        </div>
    );
}
