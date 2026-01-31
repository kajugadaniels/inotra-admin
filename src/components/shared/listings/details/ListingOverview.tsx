import Image from "next/image";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import { useState } from "react";

import type { PlaceDetail } from "@/api/types";

type ListingOverviewProps = {
    listing: PlaceDetail | null;
    isLoading: boolean;
};

const ListingOverview = ({ listing, isLoading }: ListingOverviewProps) => {
    const heroImage = listing?.images?.[0]?.image_url ?? null;
    const [selectedImage, setSelectedImage] = useState(heroImage);

    const handleThumbnailClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    return (
        <div className="mt-6 grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
            {/* Main Image and Description Section */}
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-xl shadow-black/5 w-[1000px] max-w-full backdrop-blur-xl">
                <div className="relative w-full h-72 sm:h-96">
                    {selectedImage ? (
                        <Image
                            src={selectedImage}
                            alt={listing?.name ?? "Listing"}
                            fill
                            className="object-cover transition-transform transform hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                            {isLoading ? "Loading image..." : "No image available"}
                        </div>
                    )}
                </div>

                <div className="space-y-4 p-6">
                    <div className="flex gap-4">
                        {/* Active/Inactive Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-primary hover:text-background transition-colors duration-300">
                            {listing?.is_active ? (
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                            ) : (
                                <XCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                            {listing?.is_active ? "Active" : "Inactive"}
                        </div>

                        {/* Verified/Unverified Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-primary hover:text-background transition-colors duration-300">
                            {listing?.is_verified ? (
                                <ShieldCheck className="h-4 w-4 text-primary" />
                            ) : (
                                <XCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                            {listing?.is_verified ? "Verified" : "Unverified"}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">
                            Description
                        </p>
                        <p className="mt-2 text-sm text-foreground">
                            {listing?.description ||
                                (isLoading ? "Loading..." : "No description available.")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Category and Gallery Section */}
            <div className="space-y-4">
                {/* Category */}
                <div className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-xl shadow-black/5">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        Category
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                        {listing?.category_name ?? "Uncategorized"}
                    </p>
                </div>

                {/* Image Gallery */}
                <div className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-xl shadow-black/5">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        Gallery
                    </p>
                    {listing?.images?.length ? (
                        <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {/* Thumbnails */}
                            {listing.images.map((image) => (
                                <div
                                    key={image.id}
                                    className="relative overflow-hidden rounded-xl border border-border/60 bg-background/70 cursor-pointer hover:scale-105 transition-transform duration-300"
                                    onClick={() => handleThumbnailClick(image.image_url)}
                                >
                                    <Image
                                        src={image.image_url}
                                        alt={image.caption || "Listing image"}
                                        width={80}
                                        height={80}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-muted-foreground">
                            {isLoading ? "Loading..." : "No images available."}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListingOverview;
