import { Badge } from "@/components/ui/badge";
import type { EventDetail } from "@/api/events";

type Props = {
    event: EventDetail | null;
    isLoading: boolean;
};

const formatTicketPrice = (value?: string | number | null) => {
    if (value === null || value === undefined || value === "") return "Free";
    const numeric = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(numeric)) return String(value);
    return Intl.NumberFormat(undefined, { style: "currency", currency: "RWF" }).format(numeric);
};

const EventPricingStatus = ({ event, isLoading }: Props) => {
    if (isLoading && !event) {
        return (
            <div className="rounded-3xl border border-border/60 bg-background/60 p-6 text-xs text-muted-foreground">
                Loading tickets...
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

    return (
        <div className="grid gap-4 lg:grid-cols-2 w-[850px]">
            <div className="rounded-3xl border border-border/60 bg-background/60 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Tickets
                </p>
                {event.tickets && event.tickets.length > 0 ? (
                    <div className="mt-4 space-y-2 text-sm">
                        {event.tickets.map((ticket) => (
                            <div key={ticket.id} className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground">{ticket.category}</span>
                                <span className="font-semibold text-foreground">
                                    {formatTicketPrice(ticket.price ?? null)}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-muted-foreground">No tickets configured.</p>
                )}
            </div>

            <div className="rounded-3xl border border-border/60 bg-background/60 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Visibility
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge variant={event.is_active ? "default" : "secondary"} className="rounded-full">
                        {event.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge
                        variant={event.is_verified ? "default" : "outline"}
                        className="rounded-full border-primary/40"
                    >
                        {event.is_verified ? "Verified" : "Unverified"}
                    </Badge>
                </div>
            </div>
        </div>
    );
};

export default EventPricingStatus;
