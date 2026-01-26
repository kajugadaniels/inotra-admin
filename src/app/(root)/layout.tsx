"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";
import {
    authStorage,
    fetchProfile,
    type Tokens,
    type UserProfile,
} from "@/api/auth/auth";

type RootLayoutProps = {
    children: React.ReactNode;
};

const DEFAULT_API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const ADMIN_ROLE = "ADMIN";

export default function RootLayout({ children }: RootLayoutProps) {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [authStatus, setAuthStatus] = useState<"checking" | "authorized">(
        "checking"
    );
    const redirectGuard = useRef(false);

    const apiBaseUrl = useMemo(() => {
        const trimmed = DEFAULT_API_BASE_URL.trim();
        return trimmed.replace(/\/+$/, "");
    }, []);

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

        if (user) {
            if (user.role !== ADMIN_ROLE) {
                denyAccess("Your account does not have admin privileges.");
                return;
            }
            setAuthStatus("authorized");
            return;
        }

        fetchProfile({ apiBaseUrl, accessToken: tokens.access })
            .then((result) => {
                if (!result.ok) {
                    if (result.status === 401) {
                        return;
                    }
                    denyAccess("Your session expired. Please sign in again.");
                    return;
                }

                const profile = result.body as UserProfile;
                if (profile.role !== ADMIN_ROLE) {
                    denyAccess("Your account does not have admin privileges.");
                    return;
                }

                authStorage.setSession(tokens as Tokens, profile);
                setAuthStatus("authorized");
            })
            .catch(() => {
                denyAccess("Unable to verify your session. Please sign in again.");
            });
    }, [apiBaseUrl, router]);

    if (authStatus !== "authorized") {
        return (
            <div className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
                <div className="rounded-3xl border border-border/60 bg-card/80 px-6 py-8 shadow-xl backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                        Verifying access
                    </p>
                    <h2 className="mt-3 text-xl font-semibold text-foreground">
                        Confirming your admin session...
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        You will be redirected to sign in if access is not authorized.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-12 pt-6 sm:px-6">
            <Navbar onToggleSidebar={() => setIsSidebarOpen((open) => !open)} />
            <div className="flex gap-6">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <section className="min-h-[60vh] w-full flex-1 rounded-3xl border border-border/60 bg-card/80 p-6 shadow-xl backdrop-blur">
                    {children}
                </section>
            </div>
        </div>
    );
}