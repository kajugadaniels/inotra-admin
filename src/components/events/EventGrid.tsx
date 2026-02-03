import type { EventListItem } from "@/api/events/listEvents";
import EventCard from "./EventCard";

type Props = {
    events: EventListItem[];
    isLoading: boolean;
};

const EventGrid = ({ events, isLoading }: Props) => {
    if (isLoading) {
        return (
            <div className="rounded-3xl border border-border/60 bg-card/70 p-10 text-center text-xs text-muted-foreground shadow-2xl shadow-black/5">
                Loading events...
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="rounded-3xl border border-border/60 bg-card/70 p-10 text-center text-xs text-muted-foreground shadow-2xl shadow-black/5">
                No events found for the selected filters.
            </div>
        );
    }

    return (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
                <EventCard key={event.id ?? event.title} event={event} />
            ))}
        </div>
    );
};

export default EventGrid;
