import Image from "next/image";
import type { EventDetail } from "@/api/events";

type Props = {
    event: EventDetail | null;
    isLoading: boolean;
};

const EventMedia = ({ event, isLoading }: Props) => {
    if (isLoading && !event) {
        return (
            <div className="w-full rounded-3xl border border-border/60 bg-background/60 p-6 text-xs text-muted-foreground">
                Loading media...
            </div>
        );
    }

    if (!event) {
        return (
            <div className="w-full rounded-3xl border border-border/60 bg-background/60 p-6 text-xs text-muted-foreground">
                Event details unavailable.
            </div>
        );
    }

    return (
        <div className="w-100 rounded-3xl border border-border/60 bg-background/60 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Banner
            </p>

            <div className="mt-4 w-full overflow-hidden rounded-3xl border border-border/60 bg-muted/40">
                {event.banner_url ? (
                    <div className="relative w-full aspect-video">
                        <Image
                            src={event.banner_url}
                            alt={event.title ?? "Event banner"}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority
                        />
                    </div>
                ) : (
                    <div className="flex w-full h-48 items-center justify-center text-xs text-muted-foreground">
                        No banner uploaded
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventMedia;
