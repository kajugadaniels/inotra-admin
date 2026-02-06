"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Edit3, Trash2, ShieldCheck, ShieldX, Tag } from "lucide-react";

import { cn } from "@/lib/utils";
import { EventListItem } from "@/api/events";

type AdminEventListItem = EventListItem & {
    is_active?: boolean | null;
    is_verified?: boolean | null;
};

type Props = {
    event: AdminEventListItem;
    onView?: (event: AdminEventListItem) => void;
    onEdit?: (event: AdminEventListItem) => void;
    onDelete?: (event: AdminEventListItem) => void;
};

const safeText = (v: unknown) => (typeof v === "string" ? v.trim() : "");

const toNumber = (v: unknown) => {
    if (v === null || v === undefined || v === "") return null;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : null;
};

const initialsFrom = (value: string) => {
    const v = value.trim();
    if (!v) return "EV";
    const parts = v.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "E";
    const second = parts.length > 1 ? parts[1]?.[0] : parts[0]?.[1];
    return `${first}${second ?? ""}`.toUpperCase();
};

const formatRwfCompact = (value?: number | string | null) => {
    const n = toNumber(value);
    if (n === null) return null;

    const abs = Math.abs(n);
    const sign = n < 0 ? "-" : "";

    const fmt = (num: number) => {
        const isInt = Number.isInteger(num);
        return isInt ? String(num) : String(Number(num.toFixed(1)));
    };

    if (abs >= 1_000_000) return `${sign}Rwf ${fmt(abs / 1_000_000)}M`;
    if (abs >= 1_000) return `${sign}Rwf ${fmt(abs / 1_000)}K`;
    return `${sign}Rwf ${Math.round(abs)}`;
};

const formatTime12h = (d: Date) => {
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const suffix = hours >= 12 ? "PM" : "AM";
    const h12 = hours % 12 === 0 ? 12 : hours % 12;
    const mm = String(minutes).padStart(2, "0");
    return `${h12}:${mm} ${suffix}`;
};

const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

/**
 * Same logic as app card:
 * - If end_at exists and now > end_at => ENDED
 * - Else if start_at <= now <= end_at (or within 2h if no end) => Happening Now
 * - Else if start date is today => Today, 10:00 AM
 * - Else if tomorrow => Tomorrow, 10:00 AM
 * - Else => In X days, 10:00 AM
 */
const formatEventBadge = (startAt?: string | null, endAt?: string | null) => {
    const now = new Date();

    const start = startAt ? new Date(startAt) : null;
    const end = endAt ? new Date(endAt) : null;

    if (!start || Number.isNaN(start.getTime())) return "Upcoming";

    if (end && !Number.isNaN(end.getTime()) && now.getTime() > end.getTime()) {
        return "ENDED";
    }

    if (end && !Number.isNaN(end.getTime())) {
        if (now.getTime() >= start.getTime() && now.getTime() <= end.getTime()) {
            return "Happening Now";
        }
    } else {
        const twoHoursAfterStart = new Date(start.getTime() + 2 * 60 * 60 * 1000);
        if (now.getTime() >= start.getTime() && now.getTime() <= twoHoursAfterStart.getTime()) {
            return "Happening Now";
        }
    }

    const today0 = startOfDay(now).getTime();
    const start0 = startOfDay(start).getTime();
    const diffDays = Math.round((start0 - today0) / (24 * 60 * 60 * 1000));
    const timeLabel = formatTime12h(start);

    if (diffDays <= 0) return `Today, ${timeLabel}`;
    if (diffDays === 1) return `Tomorrow, ${timeLabel}`;
    return `In ${diffDays} days, ${timeLabel}`;
};

const ActionIconButton = ({
    label,
    onClick,
    children,
    tone = "default",
}: {
    label: string;
    onClick?: () => void;
    children: React.ReactNode;
    tone?: "default" | "danger";
}) => {
    return (
        <button
            type="button"
            aria-label={label}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick?.();
            }}
            className={cn(
                "grid h-10 w-10 place-items-center rounded-full",
                "bg-black/35 backdrop-blur-md ring-1 ring-white/12",
                "transition hover:bg-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                tone === "danger" ? "text-rose-200 hover:text-rose-100" : "text-white/90"
            )}
        >
            {children}
        </button>
    );
};

const EventCard = ({ event, onView, onEdit, onDelete }: Props) => {
    const id = safeText(event.id) || "";
    const title = safeText(event.title) || "Untitled event";

    const organizer = safeText(event.venue_name) || "Venue";

    const badge = formatEventBadge(event.start_at, event.end_at);
    const priceLabel = formatRwfCompact(event.min_ticket_price);
    const initials = initialsFrom(title);

    const badgeTone =
        badge === "ENDED"
            ? "bg-black/55 text-white/80"
            : badge === "Happening Now"
            ? "bg-white/85 text-black"
            : "bg-black/45 text-white";

    const viewHref = id ? `/events/${id}` : "#";
    const editHref = id ? `/events/${id}/edit` : "#";

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-[28px] border border-border/60 bg-card/60 shadow-sm transition",
                "hover:-translate-y-0.5 hover:shadow-lg hover:border-border/80",
                "focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 focus-within:ring-offset-background"
            )}
        >
            {/* Main clickable surface (IDENTICAL to app card) */}
            <Link
                href={viewHref}
                onClick={(e) => {
                    if (!onView) return;
                    e.preventDefault();
                    onView(event);
                }}
                className="block"
            >
                {/* Poster area */}
                <div className="relative aspect-[3/4] w-full bg-muted/40">
                    {event.banner_url ? (
                        <Image
                            src={event.banner_url}
                            alt={title}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition duration-500 group-hover:scale-[1.02]"
                            priority={false}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-muted/40" />
                    )}

                    {/* Top-left time pill */}
                    <div className="absolute left-3 top-3 z-10">
                        <div
                            className={cn(
                                "inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold backdrop-blur-md",
                                badgeTone
                            )}
                        >
                            {badge}
                        </div>

                        {/* Admin-only status pills (appear only on hover/focus, so default looks identical) */}
                        <div className="mt-2 flex flex-wrap gap-2 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                            <span
                                className={cn(
                                    "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md ring-1 ring-white/12",
                                    event.is_active ? "bg-black/40 text-white/85" : "bg-black/30 text-white/75"
                                )}
                            >
                                {event.is_active ? "Active" : "Inactive"}
                            </span>

                            <span
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md ring-1 ring-white/12",
                                    event.is_verified ? "bg-black/40 text-white/85" : "bg-black/30 text-white/75"
                                )}
                            >
                                {event.is_verified ? (
                                    <>
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        Verified
                                    </>
                                ) : (
                                    <>
                                        <ShieldX className="h-3.5 w-3.5" />
                                        Unverified
                                    </>
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Top-center tiny badge (initials) */}
                    <div className="absolute top-3 left-1/2 z-10 -translate-x-1/2">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white ring-1 ring-white/20 backdrop-blur-md">
                            <span className="text-[11px] font-bold tracking-wide">
                                {initials}
                            </span>
                        </div>
                    </div>

                    {/* Bottom readability overlay (same as app card) */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    </div>

                    {/* Bottom content (same as app card) */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                        <div className="mt-2">
                            <h3 className="line-clamp-1 text-[15px] font-semibold tracking-tight text-white">
                                {title}
                            </h3>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-black/40 px-3 py-2 text-xs font-semibold text-white/85 backdrop-blur-md ring-1 ring-white/10">
                                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-black/45 ring-1 ring-white/10">
                                        <span className="text-[10px] font-bold">
                                            {initialsFrom(organizer)}
                                        </span>
                                    </span>
                                    <span className="truncate">{organizer}</span>
                                </div>
                            </div>

                            {priceLabel ? (
                                <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-2 text-xs font-semibold text-white/85 backdrop-blur-md ring-1 ring-white/10">
                                    <span className="text-white/75">Rwf</span>
                                    <span className="whitespace-nowrap">
                                        {priceLabel.replace(/^Rwf\s*/i, "")}
                                    </span>
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-2 text-xs font-semibold text-white/70 backdrop-blur-md ring-1 ring-white/10">
                                    <Tag className="h-4 w-4 text-white/70" />
                                    <span className="whitespace-nowrap">
                                        {event.ticket_categories?.includes("FREE") ? "Free" : "Tickets"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>

            {/* Admin actions overlay (hidden by default so visual is identical) */}
            <div className="pointer-events-none absolute right-3 top-3 z-20 flex items-center gap-2 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                <div className="pointer-events-auto flex items-center gap-2">
                    <ActionIconButton
                        label="View"
                        onClick={() => {
                            if (onView) onView(event);
                        }}
                    >
                        <Eye className="h-4 w-4" />
                    </ActionIconButton>

                    <ActionIconButton
                        label="Edit"
                        onClick={() => {
                            if (onEdit) onEdit(event);
                        }}
                    >
                        {onEdit ? (
                            <Edit3 className="h-4 w-4" />
                        ) : (
                            <Link
                                href={editHref}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                className="grid h-full w-full place-items-center"
                            >
                                <Edit3 className="h-4 w-4" />
                            </Link>
                        )}
                    </ActionIconButton>

                    <ActionIconButton
                        label="Delete"
                        tone="danger"
                        onClick={() => {
                            if (onDelete) onDelete(event);
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </ActionIconButton>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
