"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Lock, Mail, UploadCloudIcon } from "lucide-react";
import { toast } from "sonner";

import { confirmAdminPasswordReset } from "@/api/auth";
import { getApiBaseUrl } from "@/config/api";
import { AdminAuthShell, AdminLoginHeader } from "@/components/shared/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RESET_EMAIL_KEY = "inotra.admin.reset.email";

const ResetPasswordPage = () => {
    const router = useRouter();
    const [isBusy, setIsBusy] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const cached = window.localStorage.getItem(RESET_EMAIL_KEY);
        if (cached) {
            setEmail(cached);
        }
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email || !otp || !newPassword || !confirmPassword) {
            toast.error("Missing details", {
                description: "Fill in email, OTP, and the new password fields.",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match", {
                description: "Please confirm the new password again.",
            });
            return;
        }

        const loadingId = toast.loading("Resetting password", {
            description: "Validating your OTP...",
        });

        setIsBusy(true);
        try {
            const result = await confirmAdminPasswordReset({
                apiBaseUrl,
                email,
                otp,
                new_password: newPassword,
                confirm_new_password: confirmPassword,
            });

            if (!result.ok) {
                toast.error("Reset failed", {
                    id: loadingId,
                    description: result.body?.message ?? "Unable to reset password.",
                });
                return;
            }

            if (typeof window !== "undefined") {
                window.localStorage.clear();
            }

            toast.success("Password updated", {
                id: loadingId,
                description: "Sign in with your new credentials.",
            });
            router.replace("/");
        } catch (error) {
            toast.error("Reset failed", {
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

    return (
        <AdminAuthShell>
            <AdminLoginHeader
                badgeText="Set new password"
            />

            <div className="space-y-3">
                <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                    Create a new password.
                </h2>
                <p className="max-w-md text-sm text-muted-foreground md:text-base">
                    Enter the OTP we sent and choose a new password for your admin account.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-4 rounded-2xl border border-border/60 bg-background/60 p-5 backdrop-blur"
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

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        OTP code
                    </label>
                    <div className="relative">
                        <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={otp}
                            onChange={(event) => setOtp(event.target.value)}
                            placeholder="Enter the code"
                            className="h-12 rounded-2xl border-border/60 bg-background/60 pl-10 pr-12 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                            disabled={isBusy}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        New password
                    </label>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            placeholder="••••••••"
                            className="h-12 rounded-2xl border-border/60 bg-background/60 pl-10 pr-12 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                            autoComplete="new-password"
                            disabled={isBusy}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Confirm password
                    </label>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            placeholder="••••••••"
                            className="h-12 rounded-2xl border-border/60 bg-background/60 pl-10 pr-12 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                            autoComplete="new-password"
                            disabled={isBusy}
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="h-11 rounded-full text-xs"
                    disabled={isBusy}
                >
                    <UploadCloudIcon className="mr-2 h-4 w-4" />
                    {isBusy ? "Updating..." : "Update password"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                    After success we clear stored data and return you to sign in.
                </p>
            </form>
        </AdminAuthShell>
    );
};

export default ResetPasswordPage;
