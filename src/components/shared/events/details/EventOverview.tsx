import { Badge } from "@/components/ui/badge";
import RichTextRenderer from "@/components/shared/listings/details/RichTextRenderer";
import type { EventDetail } from "@/api/events";

type Props = {
    event: EventDetail | null;
    isLoading: boolean;
};

const EventOverview = ({ event, isLoading }: Props) => {
    if (isLoading && !event) {
        return (
            <div className="rounded-3xl border border-border/60 bg-background/60 p-6 text-xs text-muted-foreground">
                Loading overview...
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
        <div className="grid w-full grid-cols-1 gap-4">
            <div className="rounded-3xl border border-border/60 bg-background/60 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Status
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
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
                    <div className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{event.venue_name ?? "Venue"}</span>
                        {event.city ? <span> • {event.city}</span> : null}
                        {event.country ? <span> • {event.country}</span> : null}
                    </div>
                </div>
            </div>

            {event.description ? (
                <div className="rounded-3xl border border-border/60 bg-background/60 p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Description
                    </p>
                    <div className="mt-4">
                        <RichTextRenderer html={event.description} />
                    </div>
                </div>
            ) : (
                <div className="rounded-3xl border border-border/60 bg-background/60 p-6 text-xs text-muted-foreground">
                    No description provided.
                </div>
            )}
        </div>
    );
};

export default EventOverview;

