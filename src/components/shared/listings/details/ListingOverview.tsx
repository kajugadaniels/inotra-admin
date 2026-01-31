"use client";

import Image from "next/image";
import { CheckCircle2, ShieldCheck, XCircle, ImageIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { PlaceDetail } from "@/api/types";
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

    // Keep selected image in sync when listing changes
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
        <div className="mt-6 w-[850px] backdrop-blur-xl space-y-6">
            {/* Main Image + Status + Description */}
            <section className="w-full overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-xl shadow-black/5 backdrop-blur-xl">
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
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-background">
                            {listing?.is_active ? (
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                            ) : (
                                <XCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                            {listing?.is_active ? "Active" : "Inactive"}
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-background">
                            {listing?.is_verified ? (
                                <ShieldCheck className="h-4 w-4 text-primary" />
                            ) : (
                                <XCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                            {listing?.is_verified ? "Verified" : "Unverified"}
                        </div>

                        {/* Optional image position indicator */}
                        {images.length > 0 && selectedMeta ? (
                            <div className="ml-auto inline-flex items-center rounded-full border border-border/60 bg-background/70 px-4 py-2 text-xs font-medium text-muted-foreground">
                                Image {selectedMeta.index + 1} / {images.length}
                            </div>
                        ) : null}
                    </div>

                    {/* Description */}
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

                        {/* Selected caption */}
                        {selectedMeta?.caption ? (
                            <p className="text-xs text-muted-foreground">
                                {selectedMeta.caption}
                            </p>
                        ) : null}
                    </div>
                </div>
            </section>

            {/* Below: Category + Gallery */}
            <section className="grid w-full gap-6 lg:grid-cols-3">
                {/* Category */}
                <div className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-xl shadow-black/5">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        Category
                    </p>

                    {isLoading && !listing ? (
                        <div className="mt-3 h-5 w-40 animate-pulse rounded bg-muted" />
                    ) : (
                        <p className="mt-2 text-sm font-semibold text-foreground">
                            {listing?.category_name ?? "Uncategorized"}
                        </p>
                    )}
                </div>

                {/* Gallery Carousel */}
                <div className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-xl shadow-black/5 lg:col-span-2">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">
                            Gallery
                        </p>
                        {images.length > 0 ? (
                            <p className="text-xs text-muted-foreground">
                                Click a thumbnail to preview
                            </p>
                        ) : null}
                    </div>

                    {isLoading && !listing ? (
                        <div className="mt-4 flex gap-3 overflow-hidden">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-16 w-20 animate-pulse rounded-xl bg-muted"
                                />
                            ))}
                        </div>
                    ) : images.length ? (
                        <div className="relative mt-4">
                            <Carousel
                                opts={{ align: "start" }}
                                className="w-full"
                            >
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
                                                    aria-label={image.caption ? `Select: ${image.caption}` : "Select image"}
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

                                {/* Navigation */}
                                <CarouselPrevious className="-left-3" />
                                <CarouselNext className="-right-3" />
                            </Carousel>
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-muted-foreground">
                            No images available.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ListingOverview;
