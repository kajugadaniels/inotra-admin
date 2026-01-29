"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { getPlace } from "@/api/places";
import type { PlaceDetail } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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

type ListingDetailsDialogProps = {
    listingId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const ListingDetailsDialog = ({ listingId, open, onOpenChange }: ListingDetailsDialogProps) => {
    const [listing, setListing] = useState<PlaceDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        if (!open || !listingId) return;

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
    }, [apiBaseUrl, listingId, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Listing details</DialogTitle>
                    <DialogDescription>
                        Review listing metadata, location, and imagery.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5">
                    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Listing name
                        </p>
                        <p className="mt-2 text-sm font-semibold text-foreground">
                            {listing?.name ?? (isLoading ? "Loading..." : "--")}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                            {(listing?.city || "--") + ", " + (listing?.country || "--")}
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Category
                            </p>
                            <p className="mt-2 text-sm font-semibold text-foreground">
                                {listing?.category_name ?? (isLoading ? "Loading..." : "Uncategorized")}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Status
                            </p>
                            <p className="mt-2 text-sm font-semibold text-foreground">
                                {listing
                                    ? listing.is_active
                                        ? "Active"
                                        : "Inactive"
                                    : isLoading
                                        ? "Loading..."
                                        : "--"}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Verification
                            </p>
                            <p className="mt-2 text-sm font-semibold text-foreground">
                                {listing
                                    ? listing.is_verified
                                        ? "Verified"
                                        : "Unverified"
                                    : isLoading
                                        ? "Loading..."
                                        : "--"}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Created
                            </p>
                            <p className="mt-2 text-sm font-semibold text-foreground">
                                {isLoading ? "Loading..." : formatDateTime(listing?.created_at)}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Description
                        </p>
                        <p className="mt-2 text-sm text-foreground">
                            {listing?.description || (isLoading ? "Loading..." : "No description")}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Images
                        </p>
                        {listing?.images?.length ? (
                            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                            <p className="mt-2 text-sm text-muted-foreground">
                                {isLoading ? "Loading..." : "No images available."}
                            </p>
                        )}
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Services
                        </p>
                        {listing?.services?.length ? (
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                {listing.services.map((service, index) => (
                                    <div
                                        key={service.id ?? `${service.name ?? "service"}-${index}`}
                                        className="rounded-2xl border border-border/60 bg-background/70 p-4"
                                    >
                                        <p className="text-sm font-semibold text-foreground">
                                            {service.name || "Service"}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {service.is_available ? "Available" : "Unavailable"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-muted-foreground">
                                {isLoading ? "Loading..." : "No services available."}
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ListingDetailsDialog;
