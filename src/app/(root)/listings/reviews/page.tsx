"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import {
    authStorage,
    extractErrorDetail,
    listReviews,
    toggleReviewPublish,
} from "@/api";
import type { Review } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import { Button } from "@/components/ui/button";
import ReviewsFilters, {
    type ReviewFiltersState,
} from "@/components/shared/listings/reviews/ReviewsFilters";
import ReviewsTable from "@/components/shared/listings/reviews/ReviewsTable";

const DEFAULT_FILTERS: ReviewFiltersState = {
    search: "",
    is_reported: "all",
    published: "all",
    rating: "all",
    sort: "desc",
    ordering: "created_at",
};

const PAGE_SIZE = 20;

const ListingReviewsPage = () => {
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
    const [filters, setFilters] = useState<ReviewFiltersState>(DEFAULT_FILTERS);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [busyId, setBusyId] = useState<string | undefined>();
    const [refreshTick, setRefreshTick] = useState(0);

    const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

    useEffect(() => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", { description: "Sign in again to view reviews." });
            return;
        }

        let cancelled = false;
        const run = async () => {
            setIsLoading(true);
            try {
                const result = await listReviews({
                    apiBaseUrl,
                    accessToken: tokens.access,
                    search: filters.search.trim() || undefined,
                    is_reported:
                        filters.is_reported === "all" ? undefined : filters.is_reported === "true",
                    published:
                        filters.published === "all" ? undefined : filters.published === "true",
                    rating: filters.rating === "all" ? undefined : Number(filters.rating),
                    ordering: filters.ordering,
                    sort: filters.sort,
                    page,
                    page_size: PAGE_SIZE,
                });

                if (!result.ok || !result.body) {
                    if (!cancelled) {
                        const detail = extractErrorDetail(result.body);
                        toast.error("Unable to load reviews", { description: detail });
                    }
                    return;
                }

                if (cancelled) return;
                setReviews(result.body.results);
                setTotal(result.body.count);
            } catch (error) {
                if (!cancelled) {
                    toast.error("Unable to load reviews", {
                        description: error instanceof Error ? error.message : "Check API connectivity.",
                    });
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        run();
        return () => {
            cancelled = true;
        };
    }, [apiBaseUrl, filters, page, refreshTick]);

    const handleTogglePublish = async (review: Review) => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access || !review.id) {
            toast.error("Session missing", { description: "Sign in again to update reviews." });
            return;
        }
        setBusyId(review.id);
        try {
            const result = await toggleReviewPublish({
                apiBaseUrl,
                accessToken: tokens.access,
                reviewId: review.id,
            });
            if (!result.ok || !result.body?.review) {
                const detail = extractErrorDetail(result.body);
                toast.error("Update failed", { description: detail });
                return;
            }
            const updated = result.body.review;
            setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
            toast.success("Publish state toggled");
        } catch (error) {
            toast.error("Update failed", {
                description: error instanceof Error ? error.message : "Check API connectivity.",
            });
        } finally {
            setBusyId(undefined);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
                <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:18px_18px]" />
            </div>

            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
                <header className="flex flex-col gap-3 border-b border-border/60 pb-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            Listings
                        </p>
                        <h1 className="text-2xl font-semibold">Listing reviews</h1>
                        <p className="text-sm text-muted-foreground">
                            Moderate reviews across all listings with quick toggles.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => setRefreshTick((x) => x + 1)}
                            disabled={isLoading}
                        >
                            <RefreshCw className={isLoading ? "mr-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4"} />
                            Refresh
                        </Button>
                        <div className="flex items-center rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                            {total} results
                        </div>
                    </div>
                </header>

                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                    <ReviewsFilters
                        filters={filters}
                        isLoading={isLoading}
                        onChange={setFilters}
                        onApply={() => setPage(1)}
                        onReset={() => {
                            setFilters(DEFAULT_FILTERS);
                            setPage(1);
                            setRefreshTick((x) => x + 1);
                        }}
                    />

                    <div className="space-y-4">
                        <ReviewsTable
                            reviews={reviews}
                            isLoading={isLoading}
                            busyId={busyId}
                            onTogglePublish={handleTogglePublish}
                        />

                        <div className="flex items-center justify-between gap-4 pt-2 text-sm text-muted-foreground">
                            <span>
                                Page {page} of {totalPages}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full"
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingReviewsPage;
