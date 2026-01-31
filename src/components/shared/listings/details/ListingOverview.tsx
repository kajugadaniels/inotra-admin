"use client";

import Image from "next/image";
import {
    CheckCircle2,
    ShieldCheck,
    XCircle,
    ImageIcon,
    Shapes,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { PlaceDetail } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

type ListingOverviewProps = {
    listing: PlaceDetail | null;
    isLoading: boolean;
};

const ListingOverview = ({ listing, isLoading }: ListingOverviewProps) => {
    const images = listing?.images ?? [];
    const heroImage = images?.[0]?.image_url ?? null;

    const [selectedImage, setSelectedImage] = useState<string | null>(heroImage);

    useEffect(() => {
        setSelectedImage(heroImage);
    }, [heroImage]);

    const selectedMeta = useMemo(() => {
        if (!selectedImage) return null;
        const idx = images.findIndex((img) => img.image_url === selectedImage);
        if (idx === -1) return null;
        return { ...images[idx], index: idx };
    }, [images, selectedImage]);

    const handleThumbnailClick = (imageUrl: string) => setSelectedImage(imageUrl);

    return (
        <div className="mt-6 w-[850px] space-y-6 backdrop-blur-xl">
            <section className="w-full overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-xl shadow-black/5 backdrop-blur-xl">
                {/* MAIN IMAGE */}
                <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
                    {selectedImage ? (
                        <Image
                            src={selectedImage}
                            alt={listing?.name ?? "Listing"}
                            fill
                            priority
                            className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
                            <ImageIcon className="h-4 w-4" />
                            <span>{isLoading ? "Loading image..." : "No image available"}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-5 p-6">
                    {/* THUMBNAILS BELOW MAIN IMAGE */}
                    {isLoading && !listing ? (
                        <div className="flex gap-3 overflow-hidden">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-16 w-20 animate-pulse rounded-xl bg-muted"
                                />
                            ))}
                        </div>
                    ) : images.length ? (
                        <div className="relative">
                            <Carousel opts={{ align: "start" }} className="w-full">
                                <CarouselContent>
                                    {images.map((image) => {
                                        const isSelected = image.image_url === selectedImage;

                                        return (
                                            <CarouselItem
                                                key={image.id}
                                                className="basis-1/3 sm:basis-1/5 lg:basis-1/6"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => handleThumbnailClick(image.image_url)}
                                                    className={[
                                                        "relative h-16 w-full overflow-hidden rounded-xl border bg-background/70 transition",
                                                        "hover:shadow-md hover:scale-[1.02]",
                                                        isSelected
                                                            ? "border-primary ring-2 ring-primary/40"
                                                            : "border-border/60",
                                                    ].join(" ")}
                                                    aria-label={
                                                        image.caption ? `Select: ${image.caption}` : "Select image"
                                                    }
                                                    aria-current={isSelected ? "true" : "false"}
                                                >
                                                    <Image
                                                        src={image.image_url}
                                                        alt={image.caption || "Listing image"}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </button>
                                            </CarouselItem>
                                        );
                                    })}
                                </CarouselContent>

                                <CarouselPrevious className="-left-3" />
                                <CarouselNext className="-right-3" />
                            </Carousel>

                            {/* Optional indicator */}
                            {selectedMeta ? (
                                <div className="mt-3 text-xs text-muted-foreground">
                                    Image {selectedMeta.index + 1} / {images.length}
                                    {selectedMeta.caption ? (
                                        <span className="ml-2">• {selectedMeta.caption}</span>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No images available.</p>
                    )}

                    {/* BADGES ROW (Active + Verified + Category) */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            variant={listing?.is_active ? "default" : "secondary"}
                            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-background"
                        >
                            {listing?.is_active ? (
                                <CheckCircle2 className="h-4 w-4" />
                            ) : (
                                <XCircle className="h-4 w-4" />
                            )}
                            {listing?.is_active ? "Active" : "Inactive"}
                        </Badge>

                        <Badge
                            variant={listing?.is_verified ? "default" : "secondary"}
                            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-background"
                        >
                            {listing?.is_verified ? (
                                <ShieldCheck className="h-4 w-4" />
                            ) : (
                                <XCircle className="h-4 w-4" />
                            )}
                            {listing?.is_verified ? "Verified" : "Unverified"}
                        </Badge>

                        <Badge
                            variant="outline"
                            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-background"
                        >
                            <Shapes className="h-4 w-4" />
                            {isLoading && !listing
                                ? "Loading category..."
                                : listing?.category_name ?? "Uncategorized"}
                        </Badge>
                    </div>

                    {/* DESCRIPTION LAST */}
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">
                            Description
                        </p>

                        {isLoading && !listing ? (
                            <div className="space-y-2">
                                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                                <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
                                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                            </div>
                        ) : (
                            <p className="text-sm leading-relaxed text-foreground">
                                {listing?.description || "No description available."}
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ListingOverview;
