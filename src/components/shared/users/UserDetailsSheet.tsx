"use client";

import { Mail, Phone, Shield, User, UserCheck, UserX } from "lucide-react";

import type { AdminUser } from "@/api/types";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
    user: AdminUser | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const field = (label: string, value?: string | null) => (
    <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{value || "--"}</p>
    </div>
);

export const UserDetailsSheet = ({ user, open, onOpenChange }: Props) => {
    const label = user?.name || user?.username || user?.email || "User";
    const initial = label.slice(0, 1).toUpperCase();
    const active = user?.is_active ?? true;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>User details</SheetTitle>
                    <SheetDescription>Profile and status for this customer.</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={user?.image ?? ""} alt={label} />
                            <AvatarFallback className="text-sm font-semibold">{initial}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-base font-semibold text-foreground">{label}</p>
                            <p className="text-xs text-muted-foreground">{user?.username ?? "--"}</p>
                        </div>
                        <div className="ml-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                            {active ? <UserCheck className="h-3.5 w-3.5 text-primary" /> : <UserX className="h-3.5 w-3.5 text-muted-foreground" />}
                            {active ? "Active" : "Inactive"}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {field("Email", user?.email)}
                        {field("Phone", user?.phone_number)}
                        {field("Preferred language", user?.preferred_language)}
                        {field("Role", user?.role)}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {field("Country", user?.country)}
                        {field("City", user?.city)}
                        {field("Date joined", user?.date_joined)}
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{user?.username ?? "--"}</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{user?.email ?? "--"}</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
                            <Shield className="h-4 w-4" />
                            <span>{user?.role ?? "--"}</span>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default UserDetailsSheet;
