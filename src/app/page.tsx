"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
    AdminCredentialsForm,
    AdminGoogleSignIn,
    AdminHeroPanel,
    AdminLoginHeader,
    AdminMobileHero,
} from "@/components/shared/auth";

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
                    <AdminHeroPanel />

                    <AdminMobileHero />

                    {/* RIGHT: login content */}
                    <section className="relative flex flex-col justify-center p-7 sm:p-10">
                        <AdminLoginHeader
                            isDark={isDark}
                            isMounted={isMounted}
                            onToggleTheme={() => setTheme(isDark ? "light" : "dark")}
                        />

                        <div className="space-y-3">
                            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                                Welcome, Admin.
                            </h2>
                            <p className="max-w-md text-sm text-muted-foreground md:text-base">
                                Sign in with your authorized email, phone, or username. You can also
                                use Google to continue.
                            </p>
                        </div>

                        <AdminCredentialsForm
                            identifier={identifier}
                            password={password}
                            isBusy={isBusy}
                            statusLabel={statusLabel}
                            authStatus={authStatus}
                            onIdentifierChange={setIdentifier}
                            onPasswordChange={setPassword}
                            onSubmit={handlePasswordLogin}
                        />

                        <div className="mt-7 flex items-center gap-3">
                            <div className="h-px flex-1 bg-border/60" />
                            <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                                or
                            </span>
                            <div className="h-px flex-1 bg-border/60" />
                        </div>

                        <AdminGoogleSignIn isBusy={isBusy} signInRef={signInRef} />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
