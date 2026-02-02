"use client";

import { useEffect, useId, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Calendar,
    Globe,
    Languages,
    Mail,
    MapPin,
    Phone,
    Shield,
    User,
    UserCheck,
    UserX,
    X,
    XIcon,
} from "lucide-react";

import type { AdminUser } from "@/api/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
    user: AdminUser | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const field = (label: string, value?: string | null, icon?: React.ReactNode) => (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {icon}
            <span>{label}</span>
        </div>
        <p className="mt-2 truncate text-sm text-foreground">{value || "--"}</p>
    </div>
);

const UserDetails = ({ user, open, onOpenChange }: Props) => {
    const uid = useId();

    const label = user?.name || user?.username || user?.email || "User";
    const initial = label.slice(0, 1).toUpperCase();
    const active = user?.is_active ?? true;

    const layoutKey = useMemo(() => {
        if (!user?.id) return `user-details-${uid}`;
        return `user-details-${user.id}-${uid}`;
    }, [user?.id, uid]);

    // Lock body scroll while modal is open + close on ESC
    useEffect(() => {
        if (!open) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onOpenChange(false);
        };
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [open, onOpenChange]);

    return (
        <AnimatePresence>
            {open ? (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onOpenChange(false)}
                    />

                    {/* Modal */}
                    <motion.div
                        layoutId={layoutKey}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    >
                        <div
                            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-border/60 bg-background shadow-2xl backdrop-blur-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                                        User details
                                    </p>
                                    <h2 className="mt-1 truncate text-lg font-semibold text-foreground">
                                        {label}
                                    </h2>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Profile and status for this customer.
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="h-9 w-9 rounded-full p-0"
                                    onClick={() => onOpenChange(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="space-y-5 p-5">
                                {/* Top identity row */}
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={user?.image ?? ""} alt={label} />
                                            <AvatarFallback className="text-sm font-semibold">
                                                {initial}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="min-w-0">
                                            <p className="truncate text-base font-semibold text-foreground">
                                                {label}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {user?.username ?? "--"}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className={cn(
                                            "sm:ml-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
                                            active
                                                ? "border-primary/30 bg-primary/10 text-primary"
                                                : "border-border/60 bg-background/60 text-muted-foreground"
                                        )}
                                    >
                                        {active ? (
                                            <UserCheck className="h-3.5 w-3.5" />
                                        ) : (
                                            <UserX className="h-3.5 w-3.5" />
                                        )}
                                        {active ? "Active" : "Inactive"}
                                    </div>
                                </div>

                                {/* Info grid */}
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {field("Email", user?.email, <Mail className="h-3.5 w-3.5" />)}
                                    {field("Phone", user?.phone_number, <Phone className="h-3.5 w-3.5" />)}
                                    {field(
                                        "Preferred language",
                                        user?.preferred_language,
                                        <Languages className="h-3.5 w-3.5" />
                                    )}
                                    {field("Role", user?.role, <Shield className="h-3.5 w-3.5" />)}
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    {field("Country", user?.country, <Globe className="h-3.5 w-3.5" />)}
                                    {field("City", user?.city, <MapPin className="h-3.5 w-3.5" />)}
                                    {field("Date joined", user?.date_joined, <Calendar className="h-3.5 w-3.5" />)}
                                </div>

                                {/* Quick chips */}
                                <div className="grid gap-3 md:grid-cols-3">
                                    <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        <span className="truncate">{user?.username ?? "--"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        <span className="truncate">{user?.email ?? "--"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
                                        <Shield className="h-4 w-4" />
                                        <span className="truncate">{user?.role ?? "--"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-2 border-t border-border/60 px-5 py-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 rounded-full text-xs"
                                    onClick={() => onOpenChange(false)}
                                >
                                    <XIcon className="h-4 w-4" />
                                    Close
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            ) : null}
        </AnimatePresence>
    );
};

export default UserDetails;
