"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import { authStorage, getGoogleIdentityClient } from "@/api/auth";
import type { AdminUser } from "@/api/types";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavbarProps = {
    onToggleSidebar: () => void;
};

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
    const router = useRouter();
    const [user, setUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        const syncUser = () => {
            setUser(authStorage.getUser());
        };

        syncUser();

        if (typeof window === "undefined") return;

        window.addEventListener("storage", syncUser);
        window.addEventListener("admin-profile-updated", syncUser);

        return () => {
            window.removeEventListener("storage", syncUser);
            window.removeEventListener("admin-profile-updated", syncUser);
        };
    }, []);

    const handleSignOut = () => {
        authStorage.clearSession();
        getGoogleIdentityClient()?.disableAutoSelect?.();
        toast.success("Signed out", {
            description: "Admin session cleared.",
        });
        router.replace("/");
    };

    const userLabel = user?.name || user?.email || "Admin";
    const userInitial = userLabel.slice(0, 1).toUpperCase();
    const userEmail = user?.email ?? "";

    return (
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/80 px-4 py-4 shadow-lg backdrop-blur sm:px-6">
            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onToggleSidebar}
                    className="rounded-full lg:hidden"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/50">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                </div>

                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                        Admin Console
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                        Operations Hub
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <AnimatedThemeToggler
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/70 text-foreground shadow-sm"
                />

                {/* User dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-auto rounded-full border-border/60 bg-background/70 px-3 py-1.5 hover:bg-muted/60"
                        >
                            <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7">
                                    <AvatarImage src={user?.image ?? ""} alt={userLabel} />
                                    <AvatarFallback className="text-xs font-semibold">
                                        {userInitial}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col items-start text-[11px] leading-tight">
                                    <span className="max-w-[170px] truncate font-semibold text-foreground">
                                        {userLabel}
                                    </span>
                                    <span className="text-muted-foreground">Administrator</span>
                                </div>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-64">
                        <DropdownMenuLabel className="space-y-0.5">
                            <p className="truncate text-sm font-semibold">{userLabel}</p>
                            {userEmail ? (
                                <p className="truncate text-xs font-normal text-muted-foreground">
                                    {userEmail}
                                </p>
                            ) : null}
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={() => router.push("/profile")}
                            className="cursor-pointer"
                        >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={handleSignOut}
                            className="cursor-pointer text-destructive focus:text-destructive"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default Navbar;
