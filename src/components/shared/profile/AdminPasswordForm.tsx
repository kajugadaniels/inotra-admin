import { KeyRound, Lock, UploadCloudIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AdminPasswordFormProps = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    isBusy: boolean;
    onCurrentPasswordChange: (value: string) => void;
    onNewPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const AdminPasswordForm = ({
    currentPassword,
    newPassword,
    confirmPassword,
    isBusy,
    onCurrentPasswordChange,
    onNewPasswordChange,
    onConfirmPasswordChange,
    onSubmit,
}: AdminPasswordFormProps) => {
    return (
        <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-8"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold text-foreground">Update password</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Use a strong password with uppercase letters, numbers, and symbols.
                    </p>
                </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="space-y-2 lg:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Current password (required)
                    </label>
                    <div className="relative">
                        <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="password"
                            value={currentPassword}
                            onChange={(event) => onCurrentPasswordChange(event.target.value)}
                            placeholder="••••••••"
                            disabled={isBusy}
                            className="h-12 rounded-2xl border-border/60 bg-background/60 pl-10 pr-4 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30 text-xs"
                        />
                        <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        New password (required)
                    </label>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(event) => onNewPasswordChange(event.target.value)}
                            placeholder="••••••••"
                            disabled={isBusy}
                            className="h-12 rounded-2xl border-border/60 bg-background/60 pl-10 pr-4 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30 text-xs"
                        />
                        <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Confirm new password (required)
                    </label>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => onConfirmPasswordChange(event.target.value)}
                            placeholder="••••••••"
                            disabled={isBusy}
                            className="h-12 rounded-2xl border-border/60 bg-background/60 pl-10 pr-4 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30 text-xs"
                        />
                        <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                    </div>
                </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                    After changing your password, use the new credentials to sign in.
                </p>

                <Button
                    type="submit"
                    disabled={isBusy}
                    className="h-11 rounded-full text-xs uppercase font-bold"
                >
                    <span className="inline-flex items-center gap-2 text-xs">
                        {isBusy ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <UploadCloudIcon className="mr-2 h-4 w-4" />
                                Update password
                            </>
                        )}
                    </span>
                </Button>
            </div>
        </form>
    );
};

export default AdminPasswordForm;
