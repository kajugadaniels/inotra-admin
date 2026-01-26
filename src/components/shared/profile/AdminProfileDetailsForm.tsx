import { Mail, Phone, User, UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AdminProfileDetailsFormProps = {
    name: string;
    username: string;
    email: string;
    phoneNumber: string;
    isBusy: boolean;
    onNameChange: (value: string) => void;
    onUsernameChange: (value: string) => void;
    onPhoneChange: (value: string) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const AdminProfileDetailsForm = ({
    name,
    username,
    email,
    phoneNumber,
    isBusy,
    onNameChange,
    onUsernameChange,
    onPhoneChange,
    onSubmit,
}: AdminProfileDetailsFormProps) => {
    return (
        <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-8"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-foreground">Account details</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Edit your profile information. Email is read-only.
                    </p>
                </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Full name
                    </label>
                    <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={name}
                            onChange={(event) => onNameChange(event.target.value)}
                            placeholder="Admin name"
                            disabled={isBusy}
                            className="h-12 rounded-2xl border-border/60 bg-background/60 pl-10 pr-4 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                        />
                        <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Username
                    </label>
                    <div className="relative">
                        <UserCircle className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={username}
                            onChange={(event) => onUsernameChange(event.target.value)}
                            placeholder="admin.username"
                            disabled={isBusy}
                            className="h-12 rounded-2xl border-border/60 bg-background/60 pl-10 pr-4 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                        />
                        <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Email (read only)
                    </label>
                    <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={email}
                            readOnly
                            className="h-12 rounded-2xl border-border/60 bg-background/40 pl-10 pr-4 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                        />
                        <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Phone number
                    </label>
                    <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={phoneNumber}
                            onChange={(event) => onPhoneChange(event.target.value)}
                            placeholder="+250..."
                            disabled={isBusy}
                            className="h-12 rounded-2xl border-border/60 bg-background/60 pl-10 pr-4 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                        />
                        <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                    </div>
                </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                    Changes will be applied to your admin profile immediately.
                </p>

                <Button
                    type="submit"
                    disabled={isBusy}
                    className="h-12 rounded-2xl bg-primary px-7 text-primary-foreground shadow-lg shadow-primary/20 transition hover:shadow-xl hover:shadow-primary/25 sm:w-auto"
                >
                    <span className="inline-flex items-center gap-2">
                        {isBusy ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                                Saving...
                            </>
                        ) : (
                            <>Save changes</>
                        )}
                    </span>
                </Button>
            </div>
        </form>
    );
};

export default AdminProfileDetailsForm;
