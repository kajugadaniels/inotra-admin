"use client";

import { useEffect, useState } from "react";
import { MapPin, PlaySquare } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { HighlightFormState } from "./HighlightForm";
import type { ApiResponse } from "@/api/http";
import type { PaginatedResponse, PlaceListItem } from "@/api/types";
import type { EventListItem } from "@/api/events/listEvents";

type Props = {
    form: HighlightFormState;
    setForm: React.Dispatch<React.SetStateAction<HighlightFormState>>;
    apiBaseUrl: string;
    accessToken?: string | null;
    listPlaces: (args: {
        apiBaseUrl: string;
        accessToken: string;
        search?: string;
        page?: number;
    }) => Promise<ApiResponse<PaginatedResponse<PlaceListItem>>>;
    listEvents: (args: {
        apiBaseUrl: string;
        accessToken: string;
        search?: string;
        page?: number;
    }) => Promise<ApiResponse<PaginatedResponse<EventListItem>>>;
    placeLabel: string | null;
    setPlaceLabel: (label: string | null) => void;
    eventLabel: string | null;
    setEventLabel: (label: string | null) => void;
};

const HighlightFormLinks = ({
    form,
    setForm,
    apiBaseUrl,
    accessToken,
    listPlaces,
    listEvents,
    placeLabel,
    setPlaceLabel,
    eventLabel,
    setEventLabel,
}: Props) => {
    const [placeQuery, setPlaceQuery] = useState("");
    const [eventQuery, setEventQuery] = useState("");
    const [places, setPlaces] = useState<PlaceListItem[]>([]);
    const [events, setEvents] = useState<EventListItem[]>([]);
    const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => {
            if (!accessToken) return;
            if (!placeQuery.trim()) {
                setPlaces([]);
                return;
            }
            setIsLoadingPlaces(true);
            listPlaces({
                apiBaseUrl,
                accessToken,
                search: placeQuery.trim(),
                page: 1,
            })
                .then((res) => {
                    if (res.ok && res.body?.results) setPlaces(res.body.results);
                })
                .finally(() => setIsLoadingPlaces(false));
        }, 300);
        return () => clearTimeout(t);
    }, [apiBaseUrl, accessToken, listPlaces, placeQuery]);

    useEffect(() => {
        const t = setTimeout(() => {
            if (!accessToken) return;
            if (!eventQuery.trim()) {
                setEvents([]);
                return;
            }
            setIsLoadingEvents(true);
            listEvents({
                apiBaseUrl,
                accessToken,
                search: eventQuery.trim(),
                page: 1,
            })
                .then((res) => {
                    if (res.ok && res.body?.results) setEvents(res.body.results);
                })
                .finally(() => setIsLoadingEvents(false));
        }, 300);
        return () => clearTimeout(t);
    }, [apiBaseUrl, accessToken, eventQuery, listEvents]);

    return (
        <div className="space-y-4">
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Place (optional)
                </label>
                <div className="relative">
                    <Input
                        value={placeQuery}
                        onChange={(e) => setPlaceQuery(e.target.value)}
                        placeholder="Search place by name or city"
                        className="mt-2"
                    />
                    {placeQuery && (
                        <div className="absolute z-20 mt-1 w-full rounded-xl border border-border/60 bg-card/90 shadow-lg">
                            <div className="max-h-56 overflow-auto">
                                {isLoadingPlaces ? (
                                    <div className="px-3 py-2 text-xs text-muted-foreground">Searching…</div>
                                ) : places.length === 0 ? (
                                    <div className="px-3 py-2 text-xs text-muted-foreground">No matches</div>
                                ) : (
                                    places.map((place) => (
                                        <button
                                            key={place.id}
                                            type="button"
                                            onClick={() => {
                                                setForm({ ...form, place_id: place.id ?? "" });
                                                setPlaceLabel(place.name ?? null);
                                                setPlaceQuery("");
                                            }}
                                            className={cn(
                                                "flex w-full items-center justify-between px-3 py-2 text-sm text-left",
                                                form.place_id === place.id
                                                    ? "bg-primary/10 text-primary"
                                                    : "hover:bg-muted/60"
                                            )}
                                        >
                                            <span className="truncate">{place.name ?? "Untitled place"}</span>
                                            <span className="text-xs text-muted-foreground">{place.city}</span>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Event (optional)
                </label>
                <div className="relative">
                    <Input
                        value={eventQuery}
                        onChange={(e) => setEventQuery(e.target.value)}
                        placeholder="Search event by title or venue"
                        className="mt-2"
                    />
                    {eventQuery && (
                        <div className="absolute z-20 mt-1 w-full rounded-xl border border-border/60 bg-card/90 shadow-lg">
                            <div className="max-h-56 overflow-auto">
                                {isLoadingEvents ? (
                                    <div className="px-3 py-2 text-xs text-muted-foreground">Searching…</div>
                                ) : events.length === 0 ? (
                                    <div className="px-3 py-2 text-xs text-muted-foreground">No matches</div>
                                ) : (
                                    events.map((event) => (
                                        <button
                                            key={event.id}
                                            type="button"
                                            onClick={() => {
                                                setForm({ ...form, event_id: event.id ?? "" });
                                                setEventLabel(event.title ?? null);
                                                setEventQuery("");
                                            }}
                                            className={cn(
                                                "flex w-full items-center justify-between px-3 py-2 text-sm text-left",
                                                form.event_id === event.id
                                                    ? "bg-primary/10 text-primary"
                                                    : "hover:bg-muted/60"
                                            )}
                                        >
                                            <span className="truncate">{event.title ?? "Untitled event"}</span>
                                            <span className="text-xs text-muted-foreground">{event.venue_name}</span>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {form.place_id ? (
                    <button
                        type="button"
                        onClick={() => {
                            setForm({ ...form, place_id: "" });
                            setPlaceLabel(null);
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/15"
                    >
                        <MapPin className="h-4 w-4" />
                        {placeLabel ?? "Linked place"}
                        <span className="text-[10px] uppercase tracking-[0.2em] text-primary/80">Remove</span>
                    </button>
                ) : null}
                {form.event_id ? (
                    <button
                        type="button"
                        onClick={() => {
                            setForm({ ...form, event_id: "" });
                            setEventLabel(null);
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/15"
                    >
                        <PlaySquare className="h-4 w-4" />
                        {eventLabel ?? "Linked event"}
                        <span className="text-[10px] uppercase tracking-[0.2em] text-primary/80">Remove</span>
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default HighlightFormLinks;
