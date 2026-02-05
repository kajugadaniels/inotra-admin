"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { adminSidebarLinks } from "@/constants/sidebar-links";
import { cn } from "@/lib/utils";
import Image from "next/image";

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const pathname = usePathname();
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    const isHrefActive = (href?: string | null) =>
        Boolean(href) && (pathname === href || pathname.startsWith(`${href}/`));

    const toggleSection = (label: string, nextOpen: boolean) => {
        setOpenSections((prev) => ({ ...prev, [label]: nextOpen }));
    };

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
                    "fixed left-0 top-0 z-50 flex h-full w-[19.5rem] flex-col overflow-hidden",
                    "border-r border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl transition-transform",
                    "rounded-3xl lg:!static lg:z-auto lg:!translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Premium glow */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/[0.05] to-transparent" />

                {/* Header */}
                <div className="relative px-6 pb-4 pt-8">
                    <div className="flex items-center gap-3">
                        <div className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-primary/10 ring-1 ring-primary/25">
                            {/* <div className="absolute -inset-10 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary))_0%,transparent_55%)] opacity-25" />
                            <div className="h-6 w-6 rounded-full bg-primary/25 ring-1 ring-primary/30" /> */}
                            <Image
                                src="/logo-color.png"
                                alt="Inotra Logo"
                                width={100}
                                height={100}
                                className="absolute h-full w-full text-white/90"
                            />
                        </div>

                        <div className="leading-tight">
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                INOTRA
                            </p>
                            <p className="text-xs font-semibold text-foreground">Admin Portal</p>
                        </div>
                    </div>

                    <div className="mt-6 h-px w-full bg-gradient-to-r from-border/0 via-border/70 to-border/0" />

                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                            Workspace
                        </p>
                    </div>
                </div>

                {/* Nav */}
                <div className="relative flex-1 px-4 pb-6">
                    <nav className="h-full overflow-y-auto pr-1 [scrollbar-width:thin]">
                        <div className="flex flex-col gap-2">
                            {adminSidebarLinks.map((link) => {
                                const Icon = link.icon;

                                // Dropdown section
                                if (link.children?.length) {
                                    const activeChildHref =
                                        link.children
                                            .map((c) => c.href)
                                            .filter((h): h is string => Boolean(h))
                                            .filter((h) => isHrefActive(h))
                                            .sort((a, b) => b.length - a.length)[0] ?? null;

                                    const isChildActive = Boolean(activeChildHref);

                                    const isExpanded =
                                        openSections[link.label] !== undefined
                                            ? openSections[link.label]
                                            : isChildActive;

                                    return (
                                        <div key={link.label} className="space-y-2">
                                            <button
                                                type="button"
                                                onClick={() => toggleSection(link.label, !isExpanded)}
                                                className={cn(
                                                    "group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-medium transition",
                                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                    // Premium base look
                                                    "border border-border/50 bg-gradient-to-r from-muted/20 via-transparent to-transparent",
                                                    "hover:border-border/70 hover:bg-muted/30",
                                                    isChildActive &&
                                                    "border-primary/25 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent text-foreground"
                                                )}
                                                aria-expanded={isExpanded}
                                                aria-controls={`sidebar-${link.label}`}
                                            >
                                                {/* Active rail */}
                                                <span
                                                    className={cn(
                                                        "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full transition",
                                                        isChildActive
                                                            ? "bg-primary"
                                                            : "bg-transparent group-hover:bg-border/60"
                                                    )}
                                                    aria-hidden="true"
                                                />

                                                {/* Icon capsule */}
                                                <span
                                                    className={cn(
                                                        "grid h-9 w-9 place-items-center rounded-full transition",
                                                        "ring-1 ring-border/50",
                                                        isChildActive
                                                            ? "bg-primary/15 ring-primary/25"
                                                            : "bg-muted/20 group-hover:bg-muted/40"
                                                    )}
                                                >
                                                    <Icon className="h-[18px] w-[18px]" />
                                                </span>

                                                <span className="flex-1 truncate text-left text-muted-foreground group-hover:text-foreground">
                                                    {link.label}
                                                </span>

                                                {/* Section count pill */}
                                                <span
                                                    className={cn(
                                                        "hidden sm:inline-flex items-center rounded-full border border-border/60 bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground",
                                                        isChildActive && "border-primary/20 bg-primary/10"
                                                    )}
                                                >
                                                    {link.children.length}
                                                </span>

                                                <ChevronDown
                                                    className={cn(
                                                        "h-4 w-4 transition-transform",
                                                        isExpanded
                                                            ? "rotate-180 text-foreground"
                                                            : "text-muted-foreground"
                                                    )}
                                                    aria-hidden="true"
                                                />

                                                {/* Sheen */}
                                                <span
                                                    className={cn(
                                                        "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition",
                                                        "bg-gradient-to-r from-transparent via-white/5 to-transparent",
                                                        "group-hover:opacity-100"
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            </button>

                                            {/* Dropdown panel (unique/premium) */}
                                            <div
                                                id={`sidebar-${link.label}`}
                                                className={cn(
                                                    "overflow-hidden transition-[max-height,opacity,transform] duration-300",
                                                    isExpanded
                                                        ? "max-h-72 opacity-100 translate-y-0"
                                                        : "max-h-0 opacity-0 -translate-y-1"
                                                )}
                                            >
                                                <div className="rounded-2xl border border-border/60 bg-background/50 p-2 shadow-inner shadow-black/5">
                                                    <div className="relative pl-5">
                                                        {/* Timeline line */}
                                                        <span
                                                            className="pointer-events-none absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-border/0 via-border/70 to-border/0"
                                                            aria-hidden="true"
                                                        />

                                                        <div className="flex flex-col gap-1">
                                                            {link.children.map((child) => {
                                                                const childActive = child.href === activeChildHref;
                                                                const ChildIcon = child.icon;

                                                                return (
                                                                    <Link
                                                                        key={child.href}
                                                                        href={child.href ?? "#"}
                                                                        onClick={onClose}
                                                                        className={cn(
                                                                            "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition",
                                                                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                                            childActive
                                                                                ? "bg-primary/10 text-foreground ring-1 ring-primary/20"
                                                                                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                                                                        )}
                                                                    >
                                                                        {/* Timeline dot */}
                                                                        <span
                                                                            className={cn(
                                                                                "absolute -left-[10px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border transition",
                                                                                childActive
                                                                                    ? "border-primary bg-primary/60"
                                                                                    : "border-border/70 bg-background group-hover:bg-muted"
                                                                            )}
                                                                            aria-hidden="true"
                                                                        />

                                                                        <span
                                                                            className={cn(
                                                                                "grid h-8 w-8 place-items-center rounded-full transition",
                                                                                "ring-1 ring-border/50",
                                                                                childActive
                                                                                    ? "bg-primary/15 ring-primary/25"
                                                                                    : "bg-muted/20 group-hover:bg-muted/40"
                                                                            )}
                                                                        >
                                                                            <ChildIcon className="h-4 w-4" />
                                                                        </span>

                                                                        <span className="truncate">{child.label}</span>

                                                                        {/* Active micro-rail on right */}
                                                                        <span
                                                                            className={cn(
                                                                                "ml-auto h-6 w-1 rounded-full transition",
                                                                                childActive
                                                                                    ? "bg-primary"
                                                                                    : "bg-transparent group-hover:bg-border/60"
                                                                            )}
                                                                            aria-hidden="true"
                                                                        />
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                // Single link
                                const isActive = isHrefActive(link.href);

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href ?? "#"}
                                        onClick={onClose}
                                        className={cn(
                                            "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-medium transition",
                                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                            "border border-border/50 bg-gradient-to-r from-muted/20 via-transparent to-transparent",
                                            "hover:border-border/70 hover:bg-muted/30",
                                            isActive &&
                                            "border-primary/25 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent text-foreground"
                                        )}
                                    >
                                        {/* Active rail */}
                                        <span
                                            className={cn(
                                                "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full transition",
                                                isActive
                                                    ? "bg-primary"
                                                    : "bg-transparent group-hover:bg-border/60"
                                            )}
                                            aria-hidden="true"
                                        />

                                        <span
                                            className={cn(
                                                "grid h-9 w-9 place-items-center rounded-full transition",
                                                "ring-1 ring-border/50",
                                                isActive
                                                    ? "bg-primary/15 ring-primary/25"
                                                    : "bg-muted/20 group-hover:bg-muted/40"
                                            )}
                                        >
                                            <Icon className="h-[18px] w-[18px]" />
                                        </span>

                                        <span className="truncate text-muted-foreground group-hover:text-foreground">
                                            {link.label}
                                        </span>

                                        {/* Sheen */}
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
                        </div>
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
