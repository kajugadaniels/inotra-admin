import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
            <div className="w-full max-w-xl rounded-3xl border border-border/60 bg-card/70 px-8 py-10 shadow-2xl shadow-black/10 backdrop-blur-xl">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <ShieldAlert className="h-6 w-6" />
                </div>
                <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground">
                    Page not found
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    The page you’re looking for doesn’t exist or has been moved.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button asChild variant="outline" className="h-11 rounded-full">
                        <Link href="/" prefetch={false}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to sign in
                        </Link>
                    </Button>
                    <Button asChild className="h-11 rounded-full">
                        <Link href="/dashboard" prefetch={false}>
                            Go to dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
