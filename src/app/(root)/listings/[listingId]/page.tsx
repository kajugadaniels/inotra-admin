"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { getPlace } from "@/api/places";
import type { PlaceDetail } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ListingContactDetails,
    ListingDetailsSidebar,
    ListingLocationDetails,
    ListingMediaDetails,
    ListingOperationsDetails,
    ListingOverview,
} from "@/components/shared/listings/details";

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

    const tabs = [
        { key: "overview", label: "Overview", description: "Status & summary" },
        { key: "location", label: "Location", description: "Where it is located" },
        { key: "contact", label: "Contact", description: "Reach the owner" },
        { key: "operations", label: "Operations", description: "Hours & services" },
        { key: "media", label: "Media", description: "Gallery assets" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Link
                        href="/listings"
                        className="inline-flex items-center gap-2 text-xs font-bold capitalize text-muted-foreground"
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
                    <ListingDetailsSidebar tabs={tabs} />

                    <div className="space-y-6">
                        <TabsList
                            variant="line"
                            className="flex w-full flex-wrap gap-2 bg-transparent p-0 lg:hidden"
                        >
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.key}
                                    value={tab.key}
                                    className="rounded-full border border-border/60 bg-background/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="overview">
                            <ListingOverview listing={listing} isLoading={isLoading} />
                        </TabsContent>

                        <TabsContent value="location" className="w-full">
                            <div className="w-full">
                                <ListingLocationDetails
                                    listing={listing}
                                    isLoading={isLoading}
                                    mapsApiKey={mapsApiKey}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="contact">
                            <ListingContactDetails listing={listing} isLoading={isLoading} />
                        </TabsContent>

                        <TabsContent value="operations">
                            <ListingOperationsDetails listing={listing} isLoading={isLoading} />
                        </TabsContent>

                        <TabsContent value="media">
                            <ListingMediaDetails listing={listing} isLoading={isLoading} />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default ListingDetailsPage;
