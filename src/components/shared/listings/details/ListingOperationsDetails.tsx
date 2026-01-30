import type { PlaceDetail } from "@/api/types";

const dayLabels: Record<string, string> = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
};

type ListingOperationsDetailsProps = {
    listing: PlaceDetail | null;
    isLoading: boolean;
};

const ListingOperationsDetails = ({
    listing,
    isLoading,
}: ListingOperationsDetailsProps) => {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Opening hours
                </p>
                <div className="mt-4 space-y-2">
                    {listing?.opening_hours ? (
                        Object.entries(listing.opening_hours).map(([day, value]) => {
                            const label = dayLabels[day] ?? day;
                            const isClosed = Boolean((value as any)?.closed);
                            return (
                                <div
                                    key={day}
                                    className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-4 py-3"
                                >
                                    <span className="text-xs font-semibold text-foreground">
                                        {label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {isClosed
                                            ? "Closed"
                                            : `${(value as any)?.open ?? "--"} - ${(value as any)?.close ?? "--"}`}
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-xs text-muted-foreground">
                            {isLoading ? "Loading..." : "No hours set."}
                        </p>
                    )}
                </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Services
                </p>
                <div className="mt-4 space-y-2">
                    {listing?.services?.length ? (
                        listing.services.map((service, index) => (
                            <div
                                key={service.id ?? `${service.name ?? "service"}-${index}`}
                                className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-4 py-3"
                            >
                                <span className="text-xs font-semibold text-foreground">
                                    {service.name || "Service"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {service.is_available ? "Available" : "Unavailable"}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-muted-foreground">
                            {isLoading ? "Loading..." : "No services available."}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListingOperationsDetails;
