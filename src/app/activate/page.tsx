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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AdminAuthShell, AdminLoginHeader } from "@/components/shared/auth";

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
                    <Input
                        id="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isBusy}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="otp" className="text-xs font-semibold text-muted-foreground">
                        One-time code (OTP)
                    </Label>
                    <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
                        <InputOTP
                            value={otp}
                            onChange={(value) => setOtp(value)}
                            maxLength={OTP_LENGTH}
                            disabled={isBusy}
                        >
                            <InputOTPGroup>
                                {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                                    <InputOTPSlot key={index} index={index} />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                        <p className="mt-3 text-xs text-muted-foreground">
                            Tip: you can paste the full code.
                        </p>
                    </div>
                </div>

                {statusLabel ? (
                    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {statusLabel}
                    </div>
                ) : null}

                <Button type="submit" className="w-full rounded-full" disabled={isBusy}>
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
