import type { PlaceDetail } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { CheckCheckIcon, XIcon } from "lucide-react";

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
        <div className="grid lg:grid-cols-2 max-w-full backdrop-blur-xl w-full grid-cols-1 gap-4">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Opening hours
                </p>
                <div className="mt-4 space-y-2">
                    {listing?.opening_hours ? (
                        Object.entries(listing.opening_hours).map(([day, value]) => {
                            const label = dayLabels[day] ?? day;
                            const entry = value as { open?: string; close?: string; closed?: boolean } | null;
                            const isClosed = Boolean(entry?.closed);
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
                                            : `${entry?.open ?? "--"} - ${entry?.close ?? "--"}`}
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

                <div className="mt-4">
                    {listing?.services?.length ? (
                        <div className="flex flex-wrap gap-2">
                            {listing.services.map((service, index) => {
                                const key = service.id ?? `${service.name ?? "service"}-${index}`;
                                const name = service.name || "Service";
                                const available = !!service.is_available;

                                return (
                                    <Badge
                                        key={key}
                                        variant={available ? "default" : "destructive"}
                                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs"
                                        title={available ? "Available" : "Unavailable"}
                                    >
                                        {available ? (
                                            <CheckCheckIcon className="h-4 w-4" />
                                        ) : (
                                            <XIcon className="h-4 w-4" />
                                        )}
                                        <span className="font-semibold">{name}</span>
                                    </Badge>
                                );
                            })}
                        </div>
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
