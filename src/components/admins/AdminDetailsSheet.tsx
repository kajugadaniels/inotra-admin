"use client";

import { Mail, Phone, Shield, Star } from "lucide-react";

import type { AdminUser } from "@/api/types";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const field = (label: string, value?: string | null) => (
    <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{value || "--"}</p>
    </div>
);

type Props = {
    user: AdminUser | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const AdminDetailsSheet = ({ user, open, onOpenChange }: Props) => {
    const label = user?.name || user?.username || user?.email || "User";
    const initial = label.slice(0, 1).toUpperCase();
    const active = user?.is_active ?? false;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Admin details</SheetTitle>
                    <SheetDescription>Profile, status, and access metadata.</SheetDescription>
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
                        <div className="ml-auto flex items-center gap-2">
                            {user?.is_current_user ? (
                                <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px]">
                                    You
                                </Badge>
                            ) : null}
                            <Badge
                                variant={active ? "default" : "outline"}
                                className="rounded-full px-3 py-1 text-[11px]"
                            >
                                {active ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {field("Email", user?.email)}
                        {field("Phone", user?.phone_number)}
                        {field("Role", user?.role)}
                        {field("Preferred language", user?.preferred_language)}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {field("Country", user?.country)}
                        {field("City", user?.city)}
                        {field("Date joined", user?.date_joined)}
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{user?.email ?? "--"}</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{user?.phone_number ?? "--"}</span>
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

export default AdminDetailsSheet;
