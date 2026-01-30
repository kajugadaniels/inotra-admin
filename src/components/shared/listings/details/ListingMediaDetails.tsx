import Image from "next/image";

import type { PlaceDetail } from "@/api/types";

type ListingMediaDetailsProps = {
    listing: PlaceDetail | null;
    isLoading: boolean;
};

const ListingMediaDetails = ({
    listing,
    isLoading,
}: ListingMediaDetailsProps) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Gallery
            </p>
            {listing?.images?.length ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {listing.images.map((image) => (
                        <div
                            key={image.id}
                            className="overflow-hidden rounded-2xl border border-border/60 bg-background/70"
                        >
                            {image.image_url ? (
                                <Image
                                    src={image.image_url}
                                    alt={image.caption || "Listing image"}
                                    width={320}
                                    height={220}
                                    className="h-40 w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-40 items-center justify-center text-xs text-muted-foreground">
                                    No image
                                </div>
                            )}
                            {image.caption ? (
                                <p className="px-3 py-2 text-xs text-muted-foreground">
                                    {image.caption}
                                </p>
                            ) : null}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                    {isLoading ? "Loading..." : "No images available."}
                </p>
            )}
        </div>
    );
};

export default ListingMediaDetails;
