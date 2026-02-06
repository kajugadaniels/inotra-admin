import { Badge } from "@/components/ui/badge";
import type { EventDetail } from "@/api/events";

type Props = {
    event: EventDetail | null;
    isLoading: boolean;
};

const formatMoney = (value?: string | number | null) => {
    if (value === null || value === undefined) return "--";
    const numeric = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(numeric)) return String(value);
    return Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(numeric);
};

const EventPricingStatus = ({ event, isLoading }: Props) => {
    if (isLoading && !event) {
        return (
            <div className="rounded-3xl border border-border/60 bg-background/60 p-6 text-xs text-muted-foreground">
                Loading pricing...
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
        <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-border/60 bg-background/60 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Pricing
                </p>
                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-semibold text-foreground">{formatMoney(event.price)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="font-semibold text-foreground">
                            {formatMoney(event.discount_price)}
                        </span>
                    </div>
                </div>
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

