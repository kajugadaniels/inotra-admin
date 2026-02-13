import { MapPin } from "lucide-react";
import { APIProvider } from "@vis.gl/react-google-maps";

import type { ListingSubmissionDetail } from "@/api/types";
import ListingMap from "@/components/shared/listings/ListingMap";

type Props = {
    submission: ListingSubmissionDetail | null;
    isLoading: boolean;
    mapsApiKey: string;
};

const ListingSubmissionLocationDetails = ({
    submission,
    isLoading,
    mapsApiKey,
}: Props) => {
    return (
        <div className="w-full rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Location
            </div>
            <p className="mt-3 text-xs font-semibold text-foreground">
                {(submission?.city || "--") + ", " + (submission?.country || "--")}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
                {submission?.address || "No address provided."}
            </p>

            <div className="mt-6 w-full">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Map preview (optional)
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                    This map displays the stored coordinates from the submission.
                </p>
                <div className="mt-4 w-full">
                    {mapsApiKey ? (
                        <APIProvider apiKey={mapsApiKey}>
                            <ListingMap
                                latitude={
                                    submission?.latitude !== null &&
                                    submission?.latitude !== undefined
                                        ? String(submission.latitude)
                                        : ""
                                }
                                longitude={
                                    submission?.longitude !== null &&
                                    submission?.longitude !== undefined
                                        ? String(submission.longitude)
                                        : ""
                                }
                                disabled
                                onLocationSelect={() => undefined}
                            />
                        </APIProvider>
                    ) : (
                        <div className="flex h-64 w-full items-center justify-center rounded-3xl border border-border/60 bg-background/60 text-sm text-muted-foreground">
                            Add NEXT_PUBLIC_GOOGLE_MAP_API_KEY in admin/.env to render the map preview.
                        </div>
                    )}
                </div>
            </div>

            {!submission && isLoading ? (
                <p className="mt-4 text-xs text-muted-foreground">Loading location…</p>
            ) : null}
        </div>
    );
};

export default ListingSubmissionLocationDetails;

