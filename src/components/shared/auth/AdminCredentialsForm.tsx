import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type AdminCredentialsFormProps = {
    identifier: string;
    password: string;
    isBusy: boolean;
    statusLabel?: string;
    authStatus: "checking" | "signed-out" | "signing-in" | "signed-in";
    onIdentifierChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    forgotPasswordHref?: string;
};

const AdminCredentialsForm = ({
    identifier,
    password,
    isBusy,
    statusLabel,
    authStatus,
    onIdentifierChange,
    onPasswordChange,
    onSubmit,
    forgotPasswordHref,
}: AdminCredentialsFormProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form
            onSubmit={onSubmit}
            className="mt-7 space-y-5 rounded-3xl"
        >
            {/* Identifier */}
            <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Email / Phone / Username (required)
                </label>

                <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={identifier}
                        onChange={(event) => onIdentifierChange(event.target.value)}
                        placeholder="admin@example.com"
                        autoComplete="username"
                        disabled={isBusy}
                        className="h-12 rounded-2xl border-border/60 bg-background/60 pl-10 pr-4 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                    />
                    <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Password (required)
                </label>

                <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => onPasswordChange(event.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        disabled={isBusy}
                        className="h-12 rounded-2xl border-border/60 bg-background/60 pl-10 pr-12 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        disabled={isBusy}
                        className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl border border-border/60 bg-background/60 text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>

                    <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                </div>
            </div>

            {/* Submit */}
            <div className="space-y-3">
                <Button
                    type="submit"
                    disabled={isBusy}
                    className="h-12 w-full rounded-full fw-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition hover:shadow-xl hover:shadow-primary/25"
                >
                    <span className="inline-flex items-center gap-2">
                        {authStatus === "signing-in" ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="h-4 w-4" />
                                Sign in
                            </>
                        )}
                    </span>
                </Button>

                {forgotPasswordHref ? (
                    <div className="text-center text-xs text-muted-foreground">
                        <Link
                            href={forgotPasswordHref}
                            className="font-semibold text-primary hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                ) : null}

                {statusLabel ? (
                    <p className="text-center text-xs text-muted-foreground">{statusLabel}</p>
                ) : null}
            </div>
        </form>
    );
};

export default AdminCredentialsForm;
