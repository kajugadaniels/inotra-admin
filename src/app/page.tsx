"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Moon, ShieldCheck, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
    authStorage,
    exchangeAdminGoogleToken,
    loginAdminWithPassword,
    extractErrorDetail,
    getGoogleIdentityClient,
    loadGoogleIdentityScript,
    type GoogleCredentialResponse,
} from "@/api/auth";
import type { GoogleLoginResponse, LoginResponse } from "@/api/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEFAULT_API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/superadmin";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const ADMIN_ROLE = "ADMIN";
const SESSION_EXPIRED_KEY = "inotra.admin.session.expired";

const AdminLoginPage = () => {
    const router = useRouter();
    const [isBusy, setIsBusy] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [authStatus, setAuthStatus] = useState<
        "checking" | "signed-out" | "signing-in" | "signed-in"
    >("checking");
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const { resolvedTheme, setTheme } = useTheme();

    const signInRef = useRef<HTMLDivElement | null>(null);

    const apiBaseUrl = useMemo(() => {
        const trimmed = DEFAULT_API_BASE_URL.trim();
        return trimmed.replace(/\/+$/, "");
    }, []);

    const clearGoogleButton = () => {
        signInRef.current?.replaceChildren();
    };

    const handleUnauthorized = useCallback(
        (reason?: string) => {
            authStorage.clearSession();
            setAuthStatus("signed-out");
            clearGoogleButton();
            toast.error("Admin access required", {
                description:
                    reason ?? "This account is not authorized to access the admin portal.",
            });
            router.replace("/403");
        },
        [router]
    );

    useEffect(() => {
        if (typeof window !== "undefined") {
            const expired = window.sessionStorage.getItem(SESSION_EXPIRED_KEY);
            if (expired) {
                window.sessionStorage.removeItem(SESSION_EXPIRED_KEY);
                toast.error("Session expired", {
                    description: "Please sign in again to continue.",
                });
            }
        }

        const storedTokens = authStorage.getTokens();
        const storedUser = authStorage.getUser();
        setIsMounted(true);

        if (!storedTokens || !storedUser) {
            setAuthStatus("signed-out");
            return;
        }

        if (storedUser && storedUser.role !== ADMIN_ROLE) {
            handleUnauthorized("Only administrators can sign in here.");
            return;
        }

        setAuthStatus("signed-in");

        router.replace("/dashboard");
    }, [apiBaseUrl, handleUnauthorized, router]);

    const handleCredential = useCallback(
        (credentialResponse: GoogleCredentialResponse) => {
            const credential = credentialResponse.credential;
            if (!credential) {
                toast.error("Google did not return an ID token", {
                    description: "Please retry the sign-in flow.",
                });
                setAuthStatus("signed-out");
                return;
            }

            const loadingId = toast.loading("Signing you in", {
                description: "Verifying admin access...",
            });

            setIsBusy(true);
            setAuthStatus("signing-in");
            clearGoogleButton();

            exchangeAdminGoogleToken({ apiBaseUrl, idToken: credential })
                .then((result) => {
                    if (!result.ok) {
                        const detail = extractErrorDetail(result.body);
                        toast.error("Google login failed", {
                            id: loadingId,
                            description: detail,
                        });
                        setAuthStatus("signed-out");
                        return;
                    }

                    const payload = result.body as GoogleLoginResponse;
                    const responseUser = payload.user ?? null;

                    if (!responseUser) {
                        toast.error("Login response incomplete", {
                            id: loadingId,
                            description: "User information was missing from the API response.",
                        });
                        setAuthStatus("signed-out");
                        return;
                    }

                    if (responseUser.role !== ADMIN_ROLE) {
                        toast.dismiss(loadingId);
                        handleUnauthorized("Only administrators can sign in here.");
                        return;
                    }

                    if (!payload.tokens?.access || !payload.tokens?.refresh) {
                        toast.error("Login response incomplete", {
                            id: loadingId,
                            description: "Tokens were missing from the API response.",
                        });
                        setAuthStatus("signed-out");
                        return;
                    }

                    authStorage.setSession(payload.tokens, responseUser);
                    setAuthStatus("signed-in");

                    toast.success("Signed in", {
                        id: loadingId,
                        description: responseUser?.email ?? "Admin session established.",
                    });

                    router.replace("/dashboard");
                })
                .catch((error: Error) => {
                    toast.error("Login request failed", {
                        id: loadingId,
                        description: error.message ?? "Check API connectivity and CORS.",
                    });
                    setAuthStatus("signed-out");
                })
                .finally(() => {
                    setIsBusy(false);
                });
        },
        [apiBaseUrl, handleUnauthorized, router]
    );

    useEffect(() => {
        if (authStatus !== "signed-out") {
            clearGoogleButton();
            return;
        }

        if (!GOOGLE_CLIENT_ID) {
            toast.error("Google Client ID missing", {
                description:
                    "Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in admin/.env and restart the admin app.",
            });
            return;
        }

        let cancelled = false;

        loadGoogleIdentityScript()
            .then(() => {
                if (cancelled) return;

                const googleId = getGoogleIdentityClient();
                if (!googleId) {
                    toast.error("Google Identity failed to initialize", {
                        description: "The Google SDK is unavailable on this page.",
                    });
                    return;
                }

                googleId.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleCredential,
                    cancel_on_tap_outside: true,
                });

                if (signInRef.current) {
                    signInRef.current.innerHTML = "";
                    googleId.renderButton(signInRef.current, {
                        theme: "outline",
                        size: "large",
                        text: "signin_with",
                        shape: "pill",
                        width: 260,
                        logo_alignment: "left",
                    });
                }
            })
            .catch((error: Error) => {
                toast.error("Google SDK failed to load", {
                    description: error.message ?? "Check your connection or blockers.",
                });
            });

        return () => {
            cancelled = true;
        };
    }, [authStatus, handleCredential]);

    const handlePasswordLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!identifier || !password) {
            toast.error("Missing credentials", {
                description: "Enter your email, phone, or username plus password.",
            });
            return;
        }

        const loadingId = toast.loading("Signing you in", {
            description: "Checking credentials...",
        });

        setIsBusy(true);
        setAuthStatus("signing-in");

        try {
            const result = await loginAdminWithPassword({
                apiBaseUrl,
                identifier,
                password,
            });

            if (!result.ok) {
                const detail = extractErrorDetail(result.body);
                toast.error("Login failed", {
                    id: loadingId,
                    description: detail,
                });
                setAuthStatus("signed-out");
                return;
            }

            const payload = result.body as LoginResponse;
            const responseUser = payload.user ?? null;

            if (!payload.tokens?.access || !payload.tokens?.refresh) {
                toast.error("Login response incomplete", {
                    id: loadingId,
                    description: "Tokens were missing from the API response.",
                });
                setAuthStatus("signed-out");
                return;
            }

            if (!responseUser) {
                toast.error("Login response incomplete", {
                    id: loadingId,
                    description: "User information was missing from the API response.",
                });
                setAuthStatus("signed-out");
                return;
            }

            if (responseUser.role !== ADMIN_ROLE) {
                toast.dismiss(loadingId);
                handleUnauthorized("Only administrators can sign in here.");
                return;
            }

            authStorage.setSession(payload.tokens, responseUser);
            setAuthStatus("signed-in");

            toast.success("Signed in", {
                id: loadingId,
                description: responseUser.email ?? "Admin session established.",
            });

            router.replace("/dashboard");
        } catch (error) {
            toast.error("Login request failed", {
                id: loadingId,
                description:
                    error instanceof Error
                        ? error.message
                        : "Check API connectivity and CORS.",
            });
            setAuthStatus("signed-out");
        } finally {
            setIsBusy(false);
        }
    };

    const statusLabel =
        authStatus === "signing-in"
            ? "Verifying admin access..."
            : authStatus === "checking"
                ? "Checking session..."
                : "";

    const isDark = resolvedTheme === "dark";

    return (
        <div className="relative min-h-[calc(100vh-0px)] overflow-hidden">
            {/* Background (subtle) */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
                <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-primary/15 blur-3xl" />
                <div className="absolute -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:18px_18px]" />
            </div>

            <div className="mx-auto flex min-h-screen max-w-6xl items-stretch px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid w-full overflow-hidden rounded-3xl border border-border/60 bg-card/50 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.65)] backdrop-blur-xl lg:grid-cols-2">
                    {/* LEFT: premium visual */}
                    <section className="relative hidden min-h-[520px] lg:block">
                        {/* gradient base */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.10),transparent_50%),linear-gradient(135deg,rgba(0,0,0,0.65),rgba(0,0,0,0.20))]" />

                        {/* image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: "url(/login.jpg)" }}
                        />

                        {/* overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />

                        {/* glass border sheen */}
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent" />
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </div>

                        {/* content */}
                        <div className="relative flex h-full flex-col justify-between p-10">
                            <div className="flex items-center gap-3">
                                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
                                    <ShieldCheck className="h-5 w-5 text-white/90" />
                                </div>
                                <div className="leading-tight">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                                        INOTRA
                                    </p>
                                    <p className="text-sm font-semibold text-white/90">
                                        Admin Portal
                                    </p>
                                </div>
                            </div>

                            <div className="max-w-md space-y-4">

                                <h1 className="text-balance text-4xl font-semibold tracking-tight text-white">
                                    Control, insight, and secure access.
                                </h1>
                                <p className="text-sm leading-relaxed text-white/70">
                                    Manage operations with confidence. Only approved administrator
                                    accounts can access this workspace.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Mobile hero (shows on small screens) */}
                    <section className="relative lg:hidden">
                        <div
                            className="relative h-48 w-full bg-cover bg-center"
                            style={{ backgroundImage: "url(/login.jpg)" }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
                            <div className="relative flex h-full items-end p-6">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75">
                                        INOTRA • Admin
                                    </p>
                                    <p className="mt-1 text-xl font-semibold text-white">
                                        Welcome back
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* RIGHT: login content */}
                    <section className="relative flex flex-col justify-center p-7 sm:p-10">
                        {/* top tag */}
                        <div className="mb-8 flex items-center justify-between gap-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                Admin login
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 rounded-full border-border/60 bg-background/70"
                                    onClick={() => setTheme(isDark ? "light" : "dark")}
                                    aria-label={
                                        isMounted
                                            ? `Switch to ${isDark ? "light" : "dark"} mode`
                                            : "Toggle color theme"
                                    }
                                >
                                    {isMounted && isDark ? (
                                        <Sun className="h-4 w-4" />
                                    ) : (
                                        <Moon className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                                Welcome, Admin.
                            </h2>
                            <p className="max-w-md text-sm text-muted-foreground md:text-base">
                                Sign in with your authorized email, phone, or username. You can also
                                use Google to continue.
                            </p>
                        </div>

                        <form
                            onSubmit={handlePasswordLogin}
                            className="mt-7 space-y-4 rounded-2xl border border-border/60 bg-background/60 p-5 backdrop-blur"
                        >
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                    Email / Phone / Username
                                </label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={identifier}
                                        onChange={(event) => setIdentifier(event.target.value)}
                                        placeholder="admin@example.com"
                                        className="pl-10"
                                        autoComplete="username"
                                        disabled={isBusy}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        placeholder="••••••••"
                                        className="pl-10"
                                        autoComplete="current-password"
                                        disabled={isBusy}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="h-11 w-full rounded-full" disabled={isBusy}>
                                {authStatus === "signing-in" ? "Signing in..." : "Sign in"}
                            </Button>

                            {statusLabel ? (
                                <p className="text-center text-xs text-muted-foreground">
                                    {statusLabel}
                                </p>
                            ) : null}
                        </form>

                        <div className="mt-7 flex items-center gap-3">
                            <div className="h-px flex-1 bg-border/60" />
                            <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                                or
                            </span>
                            <div className="h-px flex-1 bg-border/60" />
                        </div>

                        <div className="mt-6 space-y-3">
                            <div
                                className={cn(
                                    "rounded-2xl bg-background/55 p-4 backdrop-blur",
                                    isBusy ? "pointer-events-none opacity-70" : ""
                                )}
                            >
                                <div className="flex justify-start">
                                    <div
                                        ref={signInRef}
                                        className={cn(
                                            "min-h-[48px]",
                                            isBusy ? "pointer-events-none opacity-70" : ""
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
