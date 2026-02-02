"use client";

import Image from "next/image";
import {
    CheckCircle2,
    ShieldCheck,
    XCircle,
    ImageIcon,
    Shapes,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { PlaceDetail } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";

type ListingOverviewProps = {
    listing: PlaceDetail | null;
    isLoading: boolean;
};

const ListingOverview = ({ listing, isLoading }: ListingOverviewProps) => {
    const images = useMemo(() => listing?.images ?? [], [listing?.images]);
    const heroImage = images?.[0]?.image_url ?? null;
    const logoUrl = listing?.logo_url ?? null;

    const [selectedImage, setSelectedImage] = useState<string | null>(heroImage);

    const [mainApi, setMainApi] = useState<CarouselApi | null>(null);
    const [thumbApi, setThumbApi] = useState<CarouselApi | null>(null);

    const autoplay = useRef(
        Autoplay({
            delay: 3500,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
        })
    );

    // Keep selected image in sync when listing changes
    useEffect(() => {
        setSelectedImage(heroImage);

        // when listing changes, jump to first slide
        if (mainApi && images.length) {
            mainApi.scrollTo(0, true);
        }
        if (thumbApi && images.length) {
            thumbApi.scrollTo(0, true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [heroImage]);

    // Update selected image when main carousel changes
    useEffect(() => {
        if (!mainApi || !images.length) return;

        const onSelect = () => {
            const idx = mainApi.selectedScrollSnap();
            const next = images[idx]?.image_url ?? null;
            setSelectedImage(next);

            // keep active thumb in view
            if (thumbApi) thumbApi.scrollTo(idx);
        };

        onSelect();
        mainApi.on("select", onSelect);

        return () => {
            mainApi.off("select", onSelect);
        };
    }, [mainApi, thumbApi, images]);

    const selectedMeta = useMemo(() => {
        if (!selectedImage) return null;
        const idx = images.findIndex((img) => img.image_url === selectedImage);
        if (idx === -1) return null;
        return { ...images[idx], index: idx };
    }, [images, selectedImage]);

    const handleThumbnailClick = (imageUrl: string) => {
        const idx = images.findIndex((img) => img.image_url === imageUrl);
        setSelectedImage(imageUrl);

        if (idx >= 0) {
            mainApi?.scrollTo(idx);
            thumbApi?.scrollTo(idx);
        }
    };

    const hasImages = images.length > 0;

    return (
        <section className="overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-xl shadow-black/5 backdrop-blur-xl w-[850px] space-y-6">
            <div className="p-6 space-y-5">
                {logoUrl ? (
                    <div className="flex justify-end">
                        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/70 px-3 py-2 shadow-sm">
                            <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-border/60 bg-white">
                                <Image
                                    src={logoUrl}
                                    alt={listing?.name || "Listing logo"}
                                    fill
                                    sizes="48px"
                                    className="object-contain p-1.5"
                                />
                            </div>
                            <div className="text-xs text-muted-foreground">
                                <p className="font-semibold text-foreground">Brand logo</p>
                                <p>Provided by owner</p>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* MAIN CAROUSEL */}
                <div className="relative">
                    {hasImages ? (
                        <Carousel
                            setApi={setMainApi}
                            plugins={[autoplay.current]}
                            opts={{ loop: true }}
                            className="w-full"
                        >
                            <CarouselContent>
                                {images.map((image) => (
                                    <CarouselItem key={image.id}>
                                        {/* Landscape container; portrait images will show with dark bars left/right via object-contain */}
                                        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-2xl border border-border/60 bg-black/80">
                                            <Image
                                                src={
                                                    image.image_url ||
                                                    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
                                                }
                                                alt={image.caption || listing?.name || "Listing image"}
                                                fill
                                                priority={image.image_url === heroImage}
                                                sizes="(max-width: 1024px) 100vw, 850px"
                                                className="object-contain"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {/* Main navigation arrows */}
                            <CarouselPrevious className="left-3" />
                            <CarouselNext className="right-3" />
                        </Carousel>
                    ) : (
                        <div className="flex w-full aspect-[16/9] sm:aspect-[21/9] items-center justify-center rounded-2xl border border-border/60 bg-background/70 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" />
                                <span>{isLoading ? "Loading images..." : "No image available"}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* THUMBNAILS BELOW MAIN CAROUSEL */}
                {isLoading && !listing ? (
                    <div className="flex gap-3 overflow-hidden">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-16 w-20 animate-pulse rounded-xl bg-muted"
                            />
                        ))}
                    </div>
                ) : hasImages ? (
                    <div className="relative">
                        <Carousel
                            setApi={setThumbApi}
                            opts={{ align: "start", dragFree: true }}
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
                                                onClick={() => handleThumbnailClick(image.image_url || "")}
                                                className={[
                                                    "relative h-16 w-full overflow-hidden rounded-xl border bg-background/70 transition",
                                                    "hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/40",
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
                                                    src={
                                                        image.image_url ||
                                                        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
                                                    }
                                                    alt={image.caption || "Thumbnail"}
                                                    fill
                                                    sizes="96px"
                                                    className="object-cover"
                                                />
                                            </button>
                                        </CarouselItem>
                                    );
                                })}
                            </CarouselContent>

                            {/* Thumbnail arrows */}
                            <CarouselPrevious className="-left-3" />
                            <CarouselNext className="-right-3" />
                        </Carousel>

                        {/* Indicator */}
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
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs"
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
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs"
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
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs"
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
    );
};

export default ListingOverview;
