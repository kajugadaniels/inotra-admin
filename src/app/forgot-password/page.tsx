"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { requestAdminPasswordReset } from "@/api/auth";
import { AdminAuthShell, AdminLoginHeader } from "@/components/shared/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEFAULT_API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/superadmin";
const RESET_EMAIL_KEY = "inotra.admin.reset.email";

const ForgotPasswordPage = () => {
    const router = useRouter();
    const { resolvedTheme, setTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    const [email, setEmail] = useState("");

    const apiBaseUrl = useMemo(() => {
        const trimmed = DEFAULT_API_BASE_URL.trim();
        return trimmed.replace(/\/+$/, "");
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const cached = window.localStorage.getItem(RESET_EMAIL_KEY);
        if (cached) {
            setEmail(cached);
        }
        setIsMounted(true);
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!email) {
            toast.error("Email required", {
                description: "Enter the admin email address to continue.",
            });
            return;
        }

        const loadingId = toast.loading("Sending reset code", {
            description: "Please wait while we send the OTP...",
        });

        setIsBusy(true);
        try {
            const result = await requestAdminPasswordReset(apiBaseUrl, email);
            if (!result.ok) {
                toast.error("Request failed", {
                    id: loadingId,
                    description: result.body?.message ?? "Unable to send reset code.",
                });
                return;
            }

            if (typeof window !== "undefined") {
                window.localStorage.setItem(RESET_EMAIL_KEY, email.trim());
            }

            toast.success("Reset code sent", {
                id: loadingId,
                description: "Check your email for the OTP code.",
            });
            router.push("/reset-password");
        } catch (error) {
            toast.error("Request failed", {
                id: loadingId,
                description:
                    error instanceof Error
                        ? error.message
                        : "Check API connectivity and try again.",
            });
        } finally {
            setIsBusy(false);
        }
    };

    const isDark = resolvedTheme === "dark";

    return (
        <AdminAuthShell>
            <AdminLoginHeader
                isDark={isDark}
                isMounted={isMounted}
                onToggleTheme={() => setTheme(isDark ? "light" : "dark")}
                badgeText="Password reset"
            />

            <div className="space-y-3">
                <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                    Reset your admin password.
                </h2>
                <p className="max-w-md text-sm text-muted-foreground md:text-base">
                    Enter your admin email address and we will send you a one-time code.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-4 rounded-2xl"
            >
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Email address
                    </label>
                    <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="admin@example.com"
                            className="h-12 rounded-2xl border-border/60 bg-background/60 pl-10 pr-12 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                            autoComplete="email"
                            disabled={isBusy}
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isBusy}
                    className="h-12 w-full rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition hover:shadow-xl hover:shadow-primary/25"
                >
                    {isBusy ? "Sending..." : "Send reset code"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                    We will redirect you to enter the OTP and set a new password.
                </p>
            </form>
        </AdminAuthShell>
    );
};

export default ForgotPasswordPage;
