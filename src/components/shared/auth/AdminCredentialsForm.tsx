import type { FormEvent } from "react";
import { Lock, Mail } from "lucide-react";

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
}: AdminCredentialsFormProps) => {
    return (
        <form
            onSubmit={onSubmit}
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
                        onChange={(event) => onIdentifierChange(event.target.value)}
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
                        onChange={(event) => onPasswordChange(event.target.value)}
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
                <p className="text-center text-xs text-muted-foreground">{statusLabel}</p>
            ) : null}
        </form>
    );
};

export default AdminCredentialsForm;
