"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminSidebarLinks } from "@/constants/sidebar-links";
import { cn } from "@/lib/utils";

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const pathname = usePathname();

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition lg:hidden",
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                onClick={onClose}
                aria-hidden={!isOpen}
            />

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 flex h-full w-[19rem] flex-col overflow-hidden border-r border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl transition-transform rounded-3xl lg:!static lg:z-auto lg:!translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Premium top glow */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent" />

                <div className="relative px-6 pb-6 pt-8">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-primary/10 ring-1 ring-primary/25">
                            <div className="absolute -inset-10 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary))_0%,transparent_55%)] opacity-25" />
                            <div className="h-6 w-6 rounded-full bg-primary/25 ring-1 ring-primary/30" />
                        </div>

                        <div className="leading-tight">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                INOTRA
                            </p>
                            <p className="text-sm font-semibold text-foreground">Admin Portal</p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mt-6 h-px w-full bg-gradient-to-r from-border/0 via-border/70 to-border/0" />

                    {/* Section label */}
                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                            Workspace
                        </p>
                    </div>

                    {/* Nav */}
                    <nav className="mt-4 flex flex-col gap-1.5">
                        {adminSidebarLinks.map((link) => {
                            const isActive = pathname === link.href || pathname.startsWith(link.href);
                            const Icon = link.icon;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={onClose}
                                    className={cn(
                                        "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                        isActive
                                            ? "bg-primary/10 text-foreground ring-1 ring-primary/20"
                                            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                                    )}
                                >
                                    {/* Active rail */}
                                    <span
                                        className={cn(
                                            "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full transition",
                                            isActive ? "bg-primary" : "bg-transparent group-hover:bg-border/60"
                                        )}
                                        aria-hidden="true"
                                    />

                                    <span
                                        className={cn(
                                            "grid h-9 w-9 place-items-center rounded-full transition",
                                            isActive
                                                ? "bg-primary/15 ring-1 ring-primary/20"
                                                : "bg-muted/20 group-hover:bg-muted/40"
                                        )}
                                    >
                                        <Icon className="h-[18px] w-[18px]" />
                                    </span>

                                    <span className="truncate">{link.label}</span>

                                    {/* Subtle hover sheen */}
                                    <span
                                        className={cn(
                                            "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition",
                                            "bg-gradient-to-r from-transparent via-white/5 to-transparent",
                                            "group-hover:opacity-100"
                                        )}
                                        aria-hidden="true"
                                    />
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;