"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";
import { authStorage } from "@/api/auth";
import type { AdminUser, Tokens } from "@/api/types";

type RootLayoutProps = {
    children: React.ReactNode;
};

const ADMIN_ROLE = "ADMIN";

export default function RootLayout({ children }: RootLayoutProps) {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [authStatus, setAuthStatus] = useState<"checking" | "authorized">("checking");
    const redirectGuard = useRef(false);

    useEffect(() => {
        const denyAccess = (message: string) => {
            if (redirectGuard.current) return;
            redirectGuard.current = true;
            authStorage.clearSession();
            toast.error("Admin access required", {
                description: message,
            });
            router.replace("/");
        };

        const tokens = authStorage.getTokens();
        const user = authStorage.getUser();

        if (!tokens?.access) {
            denyAccess("Please sign in with an ADMIN account to continue.");
            return;
        }

        if (!user) {
            denyAccess("Please sign in with an ADMIN account to continue.");
            return;
        }

        const adminUser = user as AdminUser;
        if (adminUser.role !== ADMIN_ROLE) {
            denyAccess("Your account does not have admin privileges.");
            return;
        }

        authStorage.setSession(tokens as Tokens, adminUser);
        setAuthStatus("authorized");
    }, [router]);

    if (authStatus !== "authorized") {
        return (
            <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
                <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(900px_circle_at_20%_10%,hsl(var(--primary)/0.10),transparent_55%),radial-gradient(700px_circle_at_80%_0%,hsl(var(--foreground)/0.06),transparent_50%)]" />
                <div className="relative mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
                    <div className="w-full max-w-xl rounded-3xl border border-border/60 bg-card/70 px-7 py-9 shadow-2xl shadow-black/10 backdrop-blur-xl">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Verifying access
                        </p>
                        <h2 className="mt-3 text-2xl font-semibold text-foreground">
                            Confirming your admin session...
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            You will be redirected to sign in if access is not authorized.
                        </p>
                        <div className="mt-6 flex items-center justify-center">
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
            {/* Premium ambient background */}
            <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(1100px_circle_at_18%_8%,hsl(var(--primary)/0.10),transparent_55%),radial-gradient(900px_circle_at_85%_0%,hsl(var(--foreground)/0.06),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/70 to-transparent" />

            {/* Wider container + more breathing room */}
            <div className="relative mx-auto flex w-full max-w-[1660px] flex-col gap-6 px-4 pb-14 pt-6 sm:px-6 lg:px-10">
                {/* Navbar gets a premium shell + sticky */}
                <div className="sticky top-0 z-40">
                    <div className="rounded-3xl border border-border/60 bg-card/60 shadow-xl shadow-black/5 backdrop-blur-xl">
                        <Navbar onToggleSidebar={() => setIsSidebarOpen((open) => !open)} />
                    </div>
                </div>

                <div className="flex gap-6 lg:gap-8">
                    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                    {/* Content: bigger padding + bigger min height + premium surface */}
                    <section className="min-h-[calc(100vh-160px)] w-full flex-1 rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-8 lg:p-10">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
