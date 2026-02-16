"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { extractErrorDetail, authStorage } from "@/api/auth";
import { activateAdmin } from "@/api/users/admins";
import { getApiBaseUrl } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { AdminAuthShell, AdminLoginHeader } from "@/components/shared/auth";
import { Mail } from "lucide-react";

const ADMIN_ROLE = "ADMIN";
const OTP_LENGTH = 6;

const ActivateAdminPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isBusy, setIsBusy] = useState(false);
    const [statusLabel, setStatusLabel] = useState("");

    const otpComplete = otp.trim().length === OTP_LENGTH;

    useEffect(() => {
        const stored = authStorage.hydrate();
        if (stored?.tokens?.access && stored?.user?.role === ADMIN_ROLE) {
            router.replace("/dashboard");
        }
    }, [router]);

    useEffect(() => {
        const pref = (searchParams.get("email") ?? "").trim();
        if (pref) setEmail(pref);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePasteOtp = (event: React.ClipboardEvent<HTMLDivElement>) => {
        const raw = event.clipboardData.getData("text") ?? "";
        const digits = raw.replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!digits) return;
        event.preventDefault();
        setOtp(digits);
        if (statusLabel) setStatusLabel("");
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (isBusy) return;

        const trimmedEmail = email.trim();
        const trimmedOtp = otp.trim();

        if (!trimmedEmail) {
            setStatusLabel("Email is required.");
            toast.error("Missing details", { description: "Please enter your email address." });
            return;
        }

        if (trimmedOtp.length < OTP_LENGTH) {
            setStatusLabel("OTP is required.");
            toast.error("Missing details", { description: "Please enter the one-time code." });
            return;
        }

        setIsBusy(true);
        setStatusLabel("");

        const loadingId = toast.loading("Activating account", {
            description: "Verifying your one-time code...",
        });

        try {
            const result = await activateAdmin({
                apiBaseUrl,
                email: trimmedEmail,
                otp: trimmedOtp,
            });

            if (!result.ok) {
                const detail = extractErrorDetail(result.body);
                setStatusLabel(detail);
                toast.error("Activation failed", { id: loadingId, description: detail });
                return;
            }

            toast.success("Account activated", {
                id: loadingId,
                description: result.body?.message ?? "You can now sign in.",
            });

            router.replace("/");
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Check API connectivity and try again.";
            setStatusLabel(message);
            toast.error("Activation failed", { id: loadingId, description: message });
        } finally {
            setIsBusy(false);
        }
    };

    return (
        <AdminAuthShell>
            <AdminLoginHeader badgeText="Activate admin" />

            <div className="space-y-3">
                <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                    Activate your admin account
                </h2>
                <p className="max-w-md text-sm text-muted-foreground md:text-base">
                    Enter the email you used to register and the one-time code (OTP) you received.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                        Email
                    </Label>
                    <div className="relative">
                        <Mail className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isBusy}
                            className="h-11 rounded-full border-border/60 bg-background/60 pl-10 pr-4 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="otp" className="text-xs font-semibold text-muted-foreground">
                        One-time code (OTP)
                    </Label>

                    <div
                        className="rounded-3xl border border-border/60 bg-background/50 p-4 shadow-sm backdrop-blur"
                        onPaste={handlePasteOtp}
                    >
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Enter your 6-digit code</p>
                            <p className="text-xs text-muted-foreground">
                                Tip: paste the full code — we’ll fill it automatically.
                            </p>
                        </div>

                        <div className="mt-4 flex justify-center">
                            <InputOTP
                                value={otp}
                                onChange={(value) => {
                                    // keep digits only for extra robustness
                                    const digits = (value ?? "").replace(/\D/g, "").slice(0, OTP_LENGTH);
                                    setOtp(digits);
                                    if (statusLabel) setStatusLabel("");
                                }}
                                maxLength={OTP_LENGTH}
                                disabled={isBusy}
                                aria-label="One-time code"
                            >
                                <InputOTPGroup className="gap-2">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <InputOTPSlot
                                            key={index}
                                            index={index}
                                            className="h-12 w-12 rounded-lg border-border/60 bg-background/60 text-base shadow-sm"
                                        />
                                    ))}
                                </InputOTPGroup>

                                <InputOTPSeparator className="mx-2 opacity-60" />

                                <InputOTPGroup className="gap-2">
                                    {Array.from({ length: 3 }).map((_, offset) => {
                                        const index = offset + 3;
                                        return (
                                            <InputOTPSlot
                                                key={index}
                                                index={index}
                                                className="h-12 w-12 rounded-lg border-border/60 bg-background/60 text-base shadow-sm"
                                            />
                                        );
                                    })}
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                            <span>{otpComplete ? "Code complete" : "Enter all 6 digits"}</span>
                            <span className="tabular-nums">{otp.length}/{OTP_LENGTH}</span>
                        </div>
                    </div>
                </div>

                {statusLabel ? (
                    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {statusLabel}
                    </div>
                ) : null}

                <Button type="submit" className="w-full rounded-full h-11" disabled={isBusy}>
                    {isBusy ? "Activating..." : "Activate account"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Already activated?{" "}
                    <Link href="/" className="font-semibold text-foreground underline-offset-4 hover:underline">
                        Back to sign in
                    </Link>
                </p>
            </form>
        </AdminAuthShell>
    );
};

export default ActivateAdminPage;
