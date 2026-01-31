import { MapPin } from "lucide-react";
import { APIProvider } from "@vis.gl/react-google-maps";

import type { PlaceDetail } from "@/api/types";
import ListingMap from "@/components/shared/listings/ListingMap";

type ListingLocationDetailsProps = {
    listing: PlaceDetail | null;
    isLoading: boolean;
    mapsApiKey: string;
};

const ListingLocationDetails = ({
    listing,
    isLoading,
    mapsApiKey,
}: ListingLocationDetailsProps) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 w-[850px] max-w-full backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Location
            </div>
            <p className="mt-3 text-xs font-semibold text-foreground">
                {(listing?.city || "--") + ", " + (listing?.country || "--")}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
                {listing?.address || "No address provided."}
            </p>

            <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Map preview (optional)
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                    This map displays the stored coordinates for the listing.
                </p>
                <div className="mt-4">
                    {mapsApiKey ? (
                        <APIProvider apiKey={mapsApiKey}>
                            <ListingMap
                                latitude={
                                    listing?.latitude !== null &&
                                    listing?.latitude !== undefined
                                        ? String(listing.latitude)
                                        : ""
                                }
                                longitude={
                                    listing?.longitude !== null &&
                                    listing?.longitude !== undefined
                                        ? String(listing.longitude)
                                        : ""
                                }
                                disabled
                                onLocationSelect={() => undefined}
                            />
                        </APIProvider>
                    ) : (
                        <div className="flex h-64 items-center justify-center rounded-3xl border border-border/60 bg-background/60 text-sm text-muted-foreground">
                            Add NEXT_PUBLIC_GOOGLE_MAP_API_KEY in admin/.env to render the map preview.
                        </div>
                    )}
                </div>
            </div>

            {!listing && isLoading ? (
                <p className="mt-4 text-xs text-muted-foreground">Loading location…</p>
            ) : null}
        </div>
    );
};

export default ListingLocationDetails;
