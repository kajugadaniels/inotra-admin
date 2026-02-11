"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { CalendarRange, MapPin } from "lucide-react";

import type { EventDetail } from "@/api/events";
import ListingMap from "@/components/shared/listings/ListingMap";

type Props = {
    event: EventDetail | null;
    isLoading: boolean;
    mapsApiKey: string;
};

const formatDateTime = (value?: string | null) => {
    if (!value) return "--";
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return "--";
    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(dt);
};

const toCoord = (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return "";
    const numeric = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(numeric)) return "";
    return numeric.toFixed(6);
};

const EventScheduleVenue = ({ event, isLoading, mapsApiKey }: Props) => {
    if (isLoading && !event) {
        return (
            <div className="rounded-3xl border border-border/60 bg-background/60 p-6 text-xs text-muted-foreground">
                Loading schedule...
            </div>
        );
    }

    if (!event) {
        return (
            <div className="rounded-3xl border border-border/60 bg-background/60 p-6 text-xs text-muted-foreground">
                Event details unavailable.
            </div>
        );
    }

    const latitude = toCoord(event.latitude);
    const longitude = toCoord(event.longitude);

    return (
        <div className="space-y-6 w-100">
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-border/60 bg-background/60 p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Schedule
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CalendarRange className="h-4 w-4" />
                            <span>Start: {formatDateTime(event.start_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarRange className="h-4 w-4" />
                            <span>End: {formatDateTime(event.end_at)}</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-border/60 bg-background/60 p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Venue
                    </p>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="font-semibold text-foreground">
                                {event.venue_name ?? "Venue TBA"}
                            </span>
                        </div>
                        {event.address ? <p>{event.address}</p> : null}
                        <p>
                            {[event.city, event.country].filter(Boolean).join(" • ") || "--"}
                        </p>
                        {(latitude && longitude) ? (
                            <p className="text-xs">
                                Coordinates: <span className="font-semibold text-foreground">{latitude}</span>,{" "}
                                <span className="font-semibold text-foreground">{longitude}</span>
                            </p>
                        ) : (
                            <p className="text-xs">Coordinates: --</p>
                        )}
                    </div>
                </div>
            </div>

            {mapsApiKey ? (
                <APIProvider apiKey={mapsApiKey}>
                    <ListingMap
                        latitude={latitude}
                        longitude={longitude}
                        disabled
                        onLocationSelect={() => undefined}
                    />
                </APIProvider>
            ) : (
                <div className="rounded-3xl border border-border/60 bg-background/60 p-6 text-xs text-muted-foreground">
                    Set <span className="font-semibold text-foreground">NEXT_PUBLIC_GOOGLE_MAP_API_KEY</span> to show the map.
                </div>
            )}
        </div>
    );
};

export default EventScheduleVenue;

