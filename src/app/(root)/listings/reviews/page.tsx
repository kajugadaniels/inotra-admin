"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { extractErrorDetail, listReviews, toggleReviewPublish } from "@/api";
import { authStorage } from "@/api/auth";
import type { Review } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import { Button } from "@/components/ui/button";
import ListingReviewsHeader from "@/components/shared/listings/reviews/ListingReviewsHeader";
import ReviewsFilters, { type ReviewFiltersState } from "@/components/shared/listings/reviews/ReviewsFilters";
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
    const [searchInput, setSearchInput] = useState("");
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
        <div className="space-y-6">
            <ListingReviewsHeader
                total={total}
                isLoading={isLoading}
                searchValue={searchInput}
                onSearchChange={setSearchInput}
                onSearchSubmit={() => {
                    setFilters((prev) => ({ ...prev, search: searchInput.trim() }));
                    setPage(1);
                    setRefreshTick((x) => x + 1);
                }}
                onRefresh={() => setRefreshTick((x) => x + 1)}
                onReset={() => {
                    setFilters(DEFAULT_FILTERS);
                    setSearchInput("");
                    setPage(1);
                    setRefreshTick((x) => x + 1);
                }}
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={() => {
                    setPage(1);
                    setRefreshTick((x) => x + 1);
                }}
            />

            <ReviewsTable
                reviews={reviews}
                isLoading={isLoading}
                busyId={busyId}
                onTogglePublish={handleTogglePublish}
            />

            <div className="flex items-center justify-between gap-4 rounded-3xl border border-border/60 bg-card/70 px-4 py-3 text-sm text-muted-foreground shadow-2xl shadow-black/5 backdrop-blur-xl">
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
    );
};

export default ListingReviewsPage;
