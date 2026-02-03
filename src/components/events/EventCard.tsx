import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CalendarRange, MapPin, ShieldCheck, ShieldX } from "lucide-react";

import type { EventListItem } from "@/api/events/listEvents";

type Props = {
    event: EventListItem;
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

const EventCard = ({ event }: Props) => {
    const priceLabel =
        event.price === null || event.price === undefined
            ? "Free"
            : typeof event.price === "string"
                ? event.price
                : Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(
                      Number(event.price)
                  );

    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-2xl shadow-black/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10">
            <div className="relative h-44 w-full bg-muted/40">
                {event.banner_url ? (
                    <Image
                        src={event.banner_url}
                        alt={event.title ?? "Event banner"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        No banner
                    </div>
                )}
                <div className="absolute left-4 top-4 flex items-center gap-2">
                    <Badge variant={event.is_active ? "default" : "secondary"} className="rounded-full">
                        {event.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge
                        variant={event.is_verified ? "default" : "outline"}
                        className="rounded-full border-primary/40 text-xs"
                    >
                        {event.is_verified ? (
                            <span className="inline-flex items-center gap-1">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Verified
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1">
                                <ShieldX className="h-3.5 w-3.5" />
                                Unverified
                            </span>
                        )}
                    </Badge>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold text-foreground">
                            {event.title ?? "Untitled event"}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">{event.venue_name ?? "Venue TBA"}</p>
                    </div>
                    <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px]">
                        {priceLabel}
                    </Badge>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CalendarRange className="h-4 w-4" />
                        <span>{formatDateTime(event.start_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.venue_name ?? "Venue TBA"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
