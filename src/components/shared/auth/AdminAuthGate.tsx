"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { authStorage } from "@/api/auth";
import { getApiBaseUrl } from "@/config/api";
import type { AdminUser, Tokens } from "@/api/types";

const ADMIN_ROLE = "ADMIN";
const SESSION_EXPIRED_KEY = "inotra.admin.session.expired";

type Status = "checking" | "authorized" | "error";

type Props = {
    children: React.ReactNode;
};

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const raw = parts[1];
    try {
        const padded = raw.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(raw.length / 4) * 4, "=");
        const json = atob(padded);
        return JSON.parse(json) as Record<string, unknown>;
    } catch {
        return null;
    }
}

function isJwtExpired(token: string, leewaySeconds = 30): boolean | null {
    const payload = decodeJwtPayload(token);
    if (!payload) return null;
    const exp = payload.exp;
    const expSeconds = typeof exp === "number" ? exp : Number(exp);
    if (!Number.isFinite(expSeconds)) return null;
    const nowSeconds = Math.floor(Date.now() / 1000);
    return expSeconds <= nowSeconds + leewaySeconds;
}

export default function AdminAuthGate({ children }: Props) {
    const router = useRouter();
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
    const [status, setStatus] = useState<Status>("checking");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const redirectGuard = useRef(false);

    const signOutAndRedirect = useCallback(
        (opts?: { markExpired?: boolean }) => {
            if (redirectGuard.current) return;
            redirectGuard.current = true;

            if (opts?.markExpired && typeof window !== "undefined") {
                try {
                    window.sessionStorage.setItem(SESSION_EXPIRED_KEY, "1");
                } catch {
                    // ignore
                }
            }

            authStorage.clearSession();
            router.replace("/");
        },
        [router]
    );

    const verifyAccess = useCallback(
        async (signal: AbortSignal) => {
            const tokens = authStorage.getTokens();
            const user = authStorage.getUser();

            if (!tokens?.access || !user) {
                signOutAndRedirect();
                return;
            }

            const adminUser = user as AdminUser;
            if (adminUser.role !== ADMIN_ROLE) {
                signOutAndRedirect();
                return;
            }

            const expired = isJwtExpired(tokens.access);
            if (expired === true) {
                signOutAndRedirect({ markExpired: true });
                return;
            }

            try {
                // Preflight: validate that the API still accepts the access token before rendering protected UI.
                // Choose a lightweight protected endpoint.
                const response = await fetch(`${apiBaseUrl}/packages/?page_size=1`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${tokens.access}`,
                    },
                    signal,
                });

                if (response.status === 401) {
                    signOutAndRedirect({ markExpired: true });
                    return;
                }

                if (!response.ok) {
                    setStatus("error");
                    setErrorMessage("Unable to verify your session. Please try again.");
                    return;
                }

                authStorage.setSession(tokens as Tokens, adminUser);
                setStatus("authorized");
            } catch (error) {
                if (error instanceof DOMException && error.name === "AbortError") return;
                setStatus("error");
                setErrorMessage("Network error while verifying your session. Please retry.");
            }
        },
        [apiBaseUrl, signOutAndRedirect]
    );

    useEffect(() => {
        const controller = new AbortController();
        setStatus("checking");
        setErrorMessage(null);
        void verifyAccess(controller.signal);
        return () => controller.abort();
    }, [verifyAccess]);

    if (status === "authorized") return <>{children}</>;

    if (status === "error") {
        return (
            <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
                <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(900px_circle_at_20%_10%,hsl(var(--primary)/0.10),transparent_55%),radial-gradient(700px_circle_at_80%_0%,hsl(var(--foreground)/0.06),transparent_50%)]" />
                <div className="relative mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
                    <div className="w-full max-w-xl rounded-3xl border border-border/60 bg-card/70 px-7 py-9 shadow-2xl shadow-black/10 backdrop-blur-xl">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">Session check failed</p>
                        <h2 className="mt-3 text-2xl font-semibold text-foreground">
                            We couldn’t verify your session
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {errorMessage ?? "Please retry. If this keeps happening, sign in again."}
                        </p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    redirectGuard.current = false;
                                    setStatus("checking");
                                    setErrorMessage(null);
                                    const retry = new AbortController();
                                    void verifyAccess(retry.signal);
                                }}
                                className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                            >
                                Retry
                            </button>
                            <button
                                type="button"
                                onClick={() => signOutAndRedirect({ markExpired: true })}
                                className="inline-flex h-10 items-center justify-center rounded-full border border-border/60 bg-background/70 px-6 text-sm font-semibold text-foreground transition hover:bg-muted/50"
                            >
                                Sign in again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
            <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(900px_circle_at_20%_10%,hsl(var(--primary)/0.10),transparent_55%),radial-gradient(700px_circle_at_80%_0%,hsl(var(--foreground)/0.06),transparent_50%)]" />
            <div className="relative mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
                <div className="w-full max-w-xl rounded-3xl border border-border/60 bg-card/70 px-7 py-9 shadow-2xl shadow-black/10 backdrop-blur-xl">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Verifying access</p>
                    <h2 className="mt-3 text-2xl font-semibold text-foreground">Confirming your admin session...</h2>
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

