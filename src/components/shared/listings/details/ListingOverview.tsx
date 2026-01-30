import Image from "next/image";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";

import type { PlaceDetail } from "@/api/types";

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

type ListingOverviewProps = {
    listing: PlaceDetail | null;
    isLoading: boolean;
};

const ListingOverview = ({ listing, isLoading }: ListingOverviewProps) => {
    const heroImage = listing?.images?.[0]?.image_url ?? null;

    return (
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
                                (isLoading ? "Loading..." : "No description available.")}
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
    );
};

export default ListingOverview;
