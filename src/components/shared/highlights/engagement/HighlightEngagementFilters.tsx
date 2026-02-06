"use client";

import { useEffect, useMemo, useState, type ReactElement } from "react";
import { Check, ChevronDown, Filter, Loader2, XIcon } from "lucide-react";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { listEvents, type EventListItem } from "@/api/events";
import type { Highlight } from "@/api/highlights/listHighlights";
import { listHighlights } from "@/api/highlights/listHighlights";
import { listPlaces } from "@/api/places";
import { listUsers } from "@/api/users/customers/listUsers";
import type { AdminUser, PlaceListItem } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    defaultHighlightEngagementFilters,
    type HighlightEngagementFiltersState,
} from "./types";

const ClearAffordance = ({
    label,
    onClear,
}: {
    label: string;
    onClear: () => void;
}) => {
    return (
        <span
            role="button"
            tabIndex={0}
            aria-label={label}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClear();
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onClear();
                }
            }}
        >
            <XIcon className="h-4 w-4" />
        </span>
    );
};

const shortId = (value?: string | null) => {
    const cleaned = (value || "").trim();
    if (!cleaned) return "";
    return cleaned.length <= 12 ? cleaned : `${cleaned.slice(0, 8)}…${cleaned.slice(-4)}`;
};

const safeText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const formatDateTime = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

type Props = {
    filters: HighlightEngagementFiltersState;
    isLoading: boolean;
    onFiltersChange: (next: HighlightEngagementFiltersState) => void;
    onApply: () => void;
    onReset: () => void;
    trigger: ReactElement;
};

const HighlightEngagementFilters = ({
    filters,
    isLoading,
    onFiltersChange,
    onApply,
    onReset,
    trigger,
}: Props) => {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<HighlightEngagementFiltersState>(filters);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => setDraft(filters), [filters]);

    const canReset = useMemo(() => {
        const base = defaultHighlightEngagementFilters;
        return JSON.stringify(filters) !== JSON.stringify(base);
    }, [filters]);

    const tokens = authStorage.getTokens();
    const canQuery = Boolean(open && tokens?.access);

    const [highlightPickerOpen, setHighlightPickerOpen] = useState(false);
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [isLoadingHighlights, setIsLoadingHighlights] = useState(false);

    const [userPickerOpen, setUserPickerOpen] = useState(false);
    const [userQuery, setUserQuery] = useState("");
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    const [placePickerOpen, setPlacePickerOpen] = useState(false);
    const [placeQuery, setPlaceQuery] = useState("");
    const [places, setPlaces] = useState<PlaceListItem[]>([]);
    const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);

    const [eventPickerOpen, setEventPickerOpen] = useState(false);
    const [eventQuery, setEventQuery] = useState("");
    const [events, setEvents] = useState<EventListItem[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);

    // Load latest highlights (no server-side search, so keep it lightweight).
    useEffect(() => {
        if (!canQuery) return;
        if (!highlightPickerOpen) return;
        if (!tokens?.access) return;

        setIsLoadingHighlights(true);
        listHighlights({ apiBaseUrl, accessToken: tokens.access, page: 1 })
            .then((res) => {
                if (!res.ok || !res.body) {
                    toast.error("Unable to load highlights", {
                        description: extractErrorDetail(res.body) || "Please try again.",
                    });
                    return;
                }
                setHighlights(res.body.results ?? []);
            })
            .catch((error: Error) => {
                toast.error("Unable to load highlights", {
                    description: error.message || "Check API connectivity.",
                });
            })
            .finally(() => setIsLoadingHighlights(false));
    }, [apiBaseUrl, canQuery, highlightPickerOpen, tokens?.access]);

    // Users search (server-side).
    useEffect(() => {
        if (!canQuery) return;
        if (!userPickerOpen) return;
        if (!tokens?.access) return;

        const timer = setTimeout(() => {
            setIsLoadingUsers(true);
            listUsers({
                apiBaseUrl,
                accessToken: tokens.access,
                search: userQuery.trim() || undefined,
                ordering: "date_joined",
                sort: "desc",
                page: 1,
            })
                .then((res) => {
                    if (!res.ok || !res.body) {
                        toast.error("Unable to load users", {
                            description: extractErrorDetail(res.body) || "Please try again.",
                        });
                        return;
                    }
                    setUsers(res.body.results ?? []);
                })
                .catch((error: Error) => {
                    toast.error("Unable to load users", {
                        description: error.message || "Check API connectivity.",
                    });
                })
                .finally(() => setIsLoadingUsers(false));
        }, 300);

        return () => clearTimeout(timer);
    }, [apiBaseUrl, canQuery, tokens?.access, userPickerOpen, userQuery]);

    // Listings search (server-side).
    useEffect(() => {
        if (!canQuery) return;
        if (!placePickerOpen) return;
        if (!tokens?.access) return;

        const timer = setTimeout(() => {
            setIsLoadingPlaces(true);
            listPlaces({
                apiBaseUrl,
                accessToken: tokens.access,
                search: placeQuery.trim() || undefined,
                ordering: "created_at",
                sort: "desc",
                page: 1,
            })
                .then((res) => {
                    if (!res.ok || !res.body) {
                        toast.error("Unable to load listings", {
                            description: extractErrorDetail(res.body) || "Please try again.",
                        });
                        return;
                    }
                    setPlaces(res.body.results ?? []);
                })
                .catch((error: Error) => {
                    toast.error("Unable to load listings", {
                        description: error.message || "Check API connectivity.",
                    });
                })
                .finally(() => setIsLoadingPlaces(false));
        }, 300);

        return () => clearTimeout(timer);
    }, [apiBaseUrl, canQuery, placePickerOpen, placeQuery, tokens?.access]);

    // Events search (server-side).
    useEffect(() => {
        if (!canQuery) return;
        if (!eventPickerOpen) return;
        if (!tokens?.access) return;

        const timer = setTimeout(() => {
            setIsLoadingEvents(true);
            listEvents({
                apiBaseUrl,
                accessToken: tokens.access,
                search: eventQuery.trim() || undefined,
                ordering: "created_at",
                sort: "desc",
                page: 1,
            })
                .then((res) => {
                    if (!res.ok || !res.body) {
                        toast.error("Unable to load events", {
                            description: extractErrorDetail(res.body) || "Please try again.",
                        });
                        return;
                    }
                    setEvents(res.body.results ?? []);
                })
                .catch((error: Error) => {
                    toast.error("Unable to load events", {
                        description: error.message || "Check API connectivity.",
                    });
                })
                .finally(() => setIsLoadingEvents(false));
        }, 300);

        return () => clearTimeout(timer);
    }, [apiBaseUrl, canQuery, eventPickerOpen, eventQuery, tokens?.access]);

    const selectedUserLabel = useMemo(() => {
        if (!draft.userId) return "";
        const found = users.find((u) => u.id === draft.userId);
        const label =
            found?.name ||
            found?.username ||
            found?.email ||
            (draft.userId ? `User ${shortId(draft.userId)}` : "");
        const email = found?.email ? ` • ${found.email}` : "";
        return `${label}${email}`.trim();
    }, [draft.userId, users]);

    const selectedPlaceLabel = useMemo(() => {
        if (!draft.placeId) return "";
        const found = places.find((p) => p.id === draft.placeId);
        const name = found?.name || (draft.placeId ? `Listing ${shortId(draft.placeId)}` : "");
        const city = safeText(found?.city);
        return city ? `${name} • ${city}` : name;
    }, [draft.placeId, places]);

    const selectedEventLabel = useMemo(() => {
        if (!draft.eventId) return "";
        const found = events.find((e) => e.id === draft.eventId);
        const title = found?.title || (draft.eventId ? `Event ${shortId(draft.eventId)}` : "");
        const venue = safeText(found?.venue_name);
        return venue ? `${title} • ${venue}` : title;
    }, [draft.eventId, events]);

    const selectedHighlightLabel = useMemo(() => {
        if (!draft.highlightId) return "";
        const found = highlights.find((h) => h.id === draft.highlightId);
        const caption = safeText(found?.caption);
        const created = formatDateTime(found?.created_at ?? null);
        if (caption && created) return `${caption} • ${created}`;
        if (caption) return caption;
        return draft.highlightId ? `Highlight ${shortId(draft.highlightId)}` : "";
    }, [draft.highlightId, highlights]);

    const fieldDisabled = isLoading || !tokens?.access;

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) {
                    setHighlightPickerOpen(false);
                    setUserPickerOpen(false);
                    setPlacePickerOpen(false);
                    setEventPickerOpen(false);
                }
            }}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-xl rounded-3xl border-border/60 bg-background/95 backdrop-blur">
                <DialogHeader>
                    <DialogTitle>Filters</DialogTitle>
                    <DialogDescription>
                        Refine engagement records by user, highlight, listing, or event.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Search (optional)
                        </label>
                        <Input
                            value={draft.search}
                            onChange={(e) => setDraft({ ...draft, search: e.target.value })}
                            placeholder="Search user, listing, event, channel, text"
                            className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                            disabled={fieldDisabled}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Highlight (optional)
                        </label>
                        <div className="relative mt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setHighlightPickerOpen((v) => !v);
                                    setUserPickerOpen(false);
                                    setPlacePickerOpen(false);
                                    setEventPickerOpen(false);
                                }}
                                className="admin-field flex w-full items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-3 py-2 text-left text-xs"
                                disabled={fieldDisabled}
                            >
                                <span className={draft.highlightId ? "text-foreground" : "text-muted-foreground"}>
                                    {draft.highlightId ? selectedHighlightLabel : "Select highlight"}
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    {draft.highlightId ? (
                                        <ClearAffordance
                                            label="Clear highlight"
                                            onClear={() => setDraft({ ...draft, highlightId: "" })}
                                        />
                                    ) : null}
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </span>
                            </button>

                            {highlightPickerOpen ? (
                                <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-xl backdrop-blur">
                                    <div className="max-h-64 overflow-auto p-1">
                                        {isLoadingHighlights ? (
                                            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Loading highlights…
                                            </div>
                                        ) : highlights.length === 0 ? (
                                            <div className="px-3 py-2 text-xs text-muted-foreground">
                                                No highlights found.
                                            </div>
                                        ) : (
                                            highlights.map((h) => {
                                                const label = safeText(h.caption) || `Highlight ${shortId(h.id ?? "")}`;
                                                const meta = formatDateTime(h.created_at ?? null);
                                                const active = draft.highlightId === h.id;
                                                return (
                                                    <button
                                                        key={h.id ?? label}
                                                        type="button"
                                                        onClick={() => {
                                                            setDraft({ ...draft, highlightId: h.id ?? "" });
                                                            setHighlightPickerOpen(false);
                                                        }}
                                                        className={`flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2 text-left text-xs transition ${
                                                            active
                                                                ? "bg-primary/10 text-primary"
                                                                : "hover:bg-muted/60"
                                                        }`}
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="truncate font-semibold">{label}</p>
                                                            {meta ? (
                                                                <p className="truncate text-[11px] text-muted-foreground">
                                                                    {meta}
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                        {active ? <Check className="mt-0.5 h-4 w-4" /> : null}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            User (optional)
                        </label>
                        <div className="relative mt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setUserPickerOpen((v) => !v);
                                    setHighlightPickerOpen(false);
                                    setPlacePickerOpen(false);
                                    setEventPickerOpen(false);
                                }}
                                className="admin-field flex w-full items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-3 py-2 text-left text-xs"
                                disabled={fieldDisabled}
                            >
                                <span className={draft.userId ? "text-foreground" : "text-muted-foreground"}>
                                    {draft.userId ? selectedUserLabel : "Select user"}
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    {draft.userId ? (
                                        <ClearAffordance
                                            label="Clear user"
                                            onClear={() => setDraft({ ...draft, userId: "" })}
                                        />
                                    ) : null}
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </span>
                            </button>

                            {userPickerOpen ? (
                                <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-xl backdrop-blur">
                                    <div className="p-3 border-b border-border/60">
                                        <Input
                                            value={userQuery}
                                            onChange={(e) => setUserQuery(e.target.value)}
                                            placeholder="Search users…"
                                            className="admin-field rounded-2xl border-border/60 bg-background/60"
                                            disabled={fieldDisabled}
                                        />
                                    </div>
                                    <div className="max-h-64 overflow-auto p-1">
                                        {isLoadingUsers ? (
                                            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Searching…
                                            </div>
                                        ) : users.length === 0 ? (
                                            <div className="px-3 py-2 text-xs text-muted-foreground">
                                                No users found.
                                            </div>
                                        ) : (
                                            users.map((u) => {
                                                const label = u.name || u.username || u.email || `User ${shortId(u.id ?? "")}`;
                                                const meta = u.email ? `${u.email}` : "";
                                                const active = draft.userId === u.id;
                                                return (
                                                    <button
                                                        key={u.id ?? label}
                                                        type="button"
                                                        onClick={() => {
                                                            setDraft({ ...draft, userId: u.id ?? "" });
                                                            setUserPickerOpen(false);
                                                        }}
                                                        className={`flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2 text-left text-xs transition ${
                                                            active
                                                                ? "bg-primary/10 text-primary"
                                                                : "hover:bg-muted/60"
                                                        }`}
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="truncate font-semibold">{label}</p>
                                                            {meta ? (
                                                                <p className="truncate text-[11px] text-muted-foreground">
                                                                    {meta}
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                        {active ? <Check className="mt-0.5 h-4 w-4" /> : null}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Listing (optional)
                        </label>
                        <div className="relative mt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setPlacePickerOpen((v) => !v);
                                    setHighlightPickerOpen(false);
                                    setUserPickerOpen(false);
                                    setEventPickerOpen(false);
                                }}
                                className="admin-field flex w-full items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-3 py-2 text-left text-xs"
                                disabled={fieldDisabled}
                            >
                                <span className={draft.placeId ? "text-foreground" : "text-muted-foreground"}>
                                    {draft.placeId ? selectedPlaceLabel : "Select listing"}
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    {draft.placeId ? (
                                        <ClearAffordance
                                            label="Clear listing"
                                            onClear={() => setDraft({ ...draft, placeId: "" })}
                                        />
                                    ) : null}
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </span>
                            </button>

                            {placePickerOpen ? (
                                <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-xl backdrop-blur">
                                    <div className="p-3 border-b border-border/60">
                                        <Input
                                            value={placeQuery}
                                            onChange={(e) => setPlaceQuery(e.target.value)}
                                            placeholder="Search listings…"
                                            className="admin-field rounded-2xl border-border/60 bg-background/60"
                                            disabled={fieldDisabled}
                                        />
                                    </div>
                                    <div className="max-h-64 overflow-auto p-1">
                                        {isLoadingPlaces ? (
                                            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Searching…
                                            </div>
                                        ) : places.length === 0 ? (
                                            <div className="px-3 py-2 text-xs text-muted-foreground">
                                                No listings found.
                                            </div>
                                        ) : (
                                            places.map((p) => {
                                                const label = p.name || `Listing ${shortId(p.id ?? "")}`;
                                                const meta = safeText(p.city);
                                                const active = draft.placeId === p.id;
                                                return (
                                                    <button
                                                        key={p.id ?? label}
                                                        type="button"
                                                        onClick={() => {
                                                            setDraft({ ...draft, placeId: p.id ?? "" });
                                                            setPlacePickerOpen(false);
                                                        }}
                                                        className={`flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2 text-left text-xs transition ${
                                                            active
                                                                ? "bg-primary/10 text-primary"
                                                                : "hover:bg-muted/60"
                                                        }`}
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="truncate font-semibold">{label}</p>
                                                            {meta ? (
                                                                <p className="truncate text-[11px] text-muted-foreground">
                                                                    {meta}
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                        {active ? <Check className="mt-0.5 h-4 w-4" /> : null}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Event (optional)
                        </label>
                        <div className="relative mt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setEventPickerOpen((v) => !v);
                                    setHighlightPickerOpen(false);
                                    setUserPickerOpen(false);
                                    setPlacePickerOpen(false);
                                }}
                                className="admin-field flex w-full items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-3 py-2 text-left text-xs"
                                disabled={fieldDisabled}
                            >
                                <span className={draft.eventId ? "text-foreground" : "text-muted-foreground"}>
                                    {draft.eventId ? selectedEventLabel : "Select event"}
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    {draft.eventId ? (
                                        <ClearAffordance
                                            label="Clear event"
                                            onClear={() => setDraft({ ...draft, eventId: "" })}
                                        />
                                    ) : null}
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </span>
                            </button>

                            {eventPickerOpen ? (
                                <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-xl backdrop-blur">
                                    <div className="p-3 border-b border-border/60">
                                        <Input
                                            value={eventQuery}
                                            onChange={(e) => setEventQuery(e.target.value)}
                                            placeholder="Search events…"
                                            className="admin-field rounded-2xl border-border/60 bg-background/60"
                                            disabled={fieldDisabled}
                                        />
                                    </div>
                                    <div className="max-h-64 overflow-auto p-1">
                                        {isLoadingEvents ? (
                                            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Searching…
                                            </div>
                                        ) : events.length === 0 ? (
                                            <div className="px-3 py-2 text-xs text-muted-foreground">
                                                No events found.
                                            </div>
                                        ) : (
                                            events.map((ev) => {
                                                const label = ev.title || `Event ${shortId(ev.id ?? "")}`;
                                                const meta = safeText(ev.venue_name);
                                                const active = draft.eventId === ev.id;
                                                return (
                                                    <button
                                                        key={ev.id ?? label}
                                                        type="button"
                                                        onClick={() => {
                                                            setDraft({ ...draft, eventId: ev.id ?? "" });
                                                            setEventPickerOpen(false);
                                                        }}
                                                        className={`flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2 text-left text-xs transition ${
                                                            active
                                                                ? "bg-primary/10 text-primary"
                                                                : "hover:bg-muted/60"
                                                        }`}
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="truncate font-semibold">{label}</p>
                                                            {meta ? (
                                                                <p className="truncate text-[11px] text-muted-foreground">
                                                                    {meta}
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                        {active ? <Check className="mt-0.5 h-4 w-4" /> : null}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Sort direction
                        </label>
                        <Select
                            value={draft.sort}
                            onValueChange={(value) =>
                                setDraft({ ...draft, sort: value === "asc" ? "asc" : "desc" })
                            }
                            disabled={fieldDisabled}
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Newest" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Newest</SelectItem>
                                <SelectItem value="asc">Oldest</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Order by
                        </label>
                        <Select
                            value={draft.ordering}
                            onValueChange={() => setDraft({ ...draft, ordering: "created_at" })}
                            disabled={fieldDisabled}
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Created at" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created_at">Created at</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full text-xs mr-5 uppercase font-bold"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                    >
                        <XIcon className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="h-11 rounded-full text-xs uppercase tracking-[0.2em] text-muted-foreground"
                        onClick={() => {
                            onReset();
                            setOpen(false);
                        }}
                        disabled={isLoading || !canReset}
                    >
                        Reset
                    </Button>

                    <Button
                        type="button"
                        className="h-11 rounded-full text-xs uppercase font-bold"
                        onClick={() => {
                            onFiltersChange(draft);
                            onApply();
                            setOpen(false);
                        }}
                        disabled={isLoading}
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Apply filters
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default HighlightEngagementFilters;
