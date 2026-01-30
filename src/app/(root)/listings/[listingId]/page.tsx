"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MapPin, Phone, ShieldCheck, XCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { getPlace } from "@/api/places";
import type { PlaceDetail } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APIProvider } from "@vis.gl/react-google-maps";
import ListingMap from "@/components/shared/listings/ListingMap";

const formatDate = (value?: string | null) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
};

const formatDateTime = (value?: string | null) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const dayLabels: Record<string, string> = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
};

const ListingDetailsPage = () => {
    const params = useParams();
    const listingId = Array.isArray(params.listingId)
        ? params.listingId[0]
        : params.listingId;

    const [listing, setListing] = useState<PlaceDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? "";

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        if (!listingId) return;
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to access listing details.",
            });
            return;
        }

        setIsLoading(true);
        getPlace({ apiBaseUrl, accessToken: tokens.access, placeId: listingId })
            .then((result) => {
                if (!result.ok || !result.body) {
                    toast.error("Unable to load listing details", {
                        description: result.body?.message ?? "Please try again.",
                    });
                    return;
                }
                setListing(result.body);
            })
            .catch((error: Error) => {
                toast.error("Unable to load listing details", {
                    description: error.message ?? "Check API connectivity and try again.",
                });
            })
            .finally(() => setIsLoading(false));
    }, [apiBaseUrl, listingId]);

    const heroImage = listing?.images?.[0]?.image_url ?? null;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Link
                        href="/listings"
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to listings
                    </Link>
                    <h1 className="mt-3 text-3xl font-semibold text-foreground">
                        {listing?.name ?? (isLoading ? "Loading listing..." : "Listing details")}
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {listing?.category_name ?? "Uncategorized"} · Created {formatDate(listing?.created_at)}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {listing?.id ? (
                        <Button asChild variant="outline" className="rounded-full">
                            <Link href={`/listings/${listing.id}/edit`}>Edit listing</Link>
                        </Button>
                    ) : null}
                </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <Tabs defaultValue="overview" orientation="vertical" className="gap-6 lg:flex-row">
                    <div className="rounded-3xl border border-border/60 bg-background/70 p-4 lg:w-60">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                            Listing sections
                        </p>
                        <TabsList
                            variant="line"
                            className="mt-4 w-full gap-2 bg-transparent p-0"
                        >
                            <TabsTrigger
                                value="overview"
                                className="w-full rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]"
                            >
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="location"
                                className="w-full rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]"
                            >
                                Location
                            </TabsTrigger>
                            <TabsTrigger
                                value="contact"
                                className="w-full rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]"
                            >
                                Contact
                            </TabsTrigger>
                            <TabsTrigger
                                value="operations"
                                className="w-full rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]"
                            >
                                Operations
                            </TabsTrigger>
                            <TabsTrigger
                                value="media"
                                className="w-full rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]"
                            >
                                Media
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="overview">
                        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-2xl shadow-black/5">
                                <div className="relative h-64 w-full">
                                    {heroImage ? (
                                        <Image
                                            src={heroImage}
                                            alt={listing?.name ?? "Listing"}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                            {isLoading ? "Loading image..." : "No image available"}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4 p-6">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                                            {listing?.is_active ? (
                                                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                            ) : (
                                                <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                            )}
                                            {listing?.is_active ? "Active" : "Inactive"}
                                        </div>
                                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                                            {listing?.is_verified ? (
                                                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                                            ) : (
                                                <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                            )}
                                            {listing?.is_verified ? "Verified" : "Unverified"}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                                            Description
                                        </p>
                                        <p className="mt-2 text-sm text-foreground">
                                            {listing?.description ||
                                                (isLoading
                                                    ? "Loading..."
                                                    : "No description available.")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        Category
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-foreground">
                                        {listing?.category_name ?? "Uncategorized"}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        Created
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-foreground">
                                        {formatDateTime(listing?.created_at)}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        Updated
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-foreground">
                                        {formatDateTime(listing?.updated_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="location">
                        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                Location
                            </div>
                            <p className="mt-3 text-sm font-semibold text-foreground">
                                {(listing?.city || "--") + ", " + (listing?.country || "--")}
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {listing?.address || "No address provided."}
                            </p>
                            <div className="mt-6">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
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
                        </div>
                    </TabsContent>

                    <TabsContent value="contact">
                        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                Contact
                            </div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        Phone
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-foreground">
                                        {listing?.phone || "--"}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        WhatsApp
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-foreground">
                                        {listing?.whatsapp || "--"}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        Email
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-foreground">
                                        {listing?.email || "--"}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        Website
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-foreground">
                                        {listing?.website || "--"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="operations">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5">
                                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                                    Opening hours
                                </p>
                                <div className="mt-4 space-y-2">
                                    {listing?.opening_hours ? (
                                        Object.entries(listing.opening_hours).map(
                                            ([day, value]) => {
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
                                            }
                                        )
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
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
                                                key={
                                                    service.id ??
                                                    `${service.name ?? "service"}-${index}`
                                                }
                                                className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-4 py-3"
                                            >
                                                <span className="text-xs font-semibold text-foreground">
                                                    {service.name || "Service"}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {service.is_available
                                                        ? "Available"
                                                        : "Unavailable"}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            {isLoading ? "Loading..." : "No services available."}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="media">
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
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ListingDetailsPage;
