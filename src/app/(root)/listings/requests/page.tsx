"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { listPlaceCategories } from "@/api/places";
import { listListingSubmissions, updateListingSubmissionStatus } from "@/api/listings/submissions";
import type { ListingSubmissionListItem, PlaceCategory } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import ListingPagination from "@/components/shared/listings/ListingPagination";
import {
    ListingRequestsHeader,
    ListingRequestRejectDialog,
    ListingRequestsTable,
    defaultListingRequestFilters,
    type ListingRequestFiltersState,
} from "@/components/shared/listings/requests";

const ListingRequests = () => {
    const [filters, setFilters] = useState<ListingRequestFiltersState>(defaultListingRequestFilters);
    const [page, setPage] = useState(1);
    const [results, setResults] = useState<ListingSubmissionListItem[]>([]);
    const [count, setCount] = useState(0);
    const [categories, setCategories] = useState<PlaceCategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState<ListingSubmissionListItem | null>(null);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(filters.search), 350);
        return () => clearTimeout(timer);
    }, [filters.search]);

    useEffect(() => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to access listing requests.",
            });
            return;
        }

        setIsLoading(true);

        Promise.all([
            listListingSubmissions({
                apiBaseUrl,
                accessToken: tokens.access,
                search: debouncedSearch || undefined,
                status: filters.status === "all" ? undefined : filters.status,
                category: filters.category === "all" ? undefined : filters.category,
                city: filters.city || undefined,
                country: filters.country || undefined,
                ordering: filters.ordering,
                sort: filters.sort,
                page,
                page_size: 20,
            }),
            listPlaceCategories({ apiBaseUrl, accessToken: tokens.access }),
        ])
            .then(([submissionsResult, categoriesResult]) => {
                if (submissionsResult.ok && submissionsResult.body) {
                    setResults(submissionsResult.body.results ?? []);
                    setCount(submissionsResult.body.count ?? 0);
                } else {
                    toast.error("Unable to load listing requests", {
                        description:
                            extractErrorDetail(submissionsResult.body) || "Please try again.",
                    });
                }

                if (categoriesResult.ok && categoriesResult.body) {
                    setCategories(categoriesResult.body);
                }
            })
            .catch((error: Error) => {
                toast.error("Unable to load listing requests", {
                    description: error.message ?? "Check API connectivity and try again.",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [
        apiBaseUrl,
        debouncedSearch,
        filters.status,
        filters.category,
        filters.city,
        filters.country,
        filters.ordering,
        filters.sort,
        page,
    ]);

    const totalPages = Math.max(Math.ceil(count / 20), 1);

    const resetFilters = () => {
        setFilters(defaultListingRequestFilters);
        setPage(1);
    };

    const handleFiltersChange = (next: ListingRequestFiltersState) => {
        setFilters(next);
        setPage(1);
    };

    const handleApprove = async (request: ListingSubmissionListItem) => {
        if (!request.id) return;
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to update listing requests.",
            });
            return;
        }

        setIsUpdating(true);
        try {
            const res = await updateListingSubmissionStatus({
                apiBaseUrl,
                accessToken: tokens.access,
                submissionId: request.id,
                status: "APPROVED",
            });

            if (!res.ok || !res.body) {
                toast.error("Unable to approve listing", {
                    description: extractErrorDetail(res.body) || "Please try again.",
                });
                return;
            }

            toast.success(res.body.message ?? "Listing approved.");
            const submission = res.body.submission;
            if (submission) {
                setResults((prev) =>
                    prev.map((item) => (item.id === request.id ? submission : item))
                );
            }
        } catch (error) {
            toast.error("Unable to approve listing", {
                description:
                    error instanceof Error ? error.message : "Check API connectivity and try again.",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRejectClick = (request: ListingSubmissionListItem) => {
        setSelected(request);
        setRejectOpen(true);
    };

    const handleReject = async (reason: string) => {
        if (!selected?.id) return;
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to update listing requests.",
            });
            return;
        }

        setIsUpdating(true);
        try {
            const res = await updateListingSubmissionStatus({
                apiBaseUrl,
                accessToken: tokens.access,
                submissionId: selected.id,
                status: "REJECTED",
                rejection_reason: reason,
            });

            if (!res.ok || !res.body) {
                toast.error("Unable to reject listing", {
                    description: extractErrorDetail(res.body) || "Please try again.",
                });
                return;
            }

            toast.success(res.body.message ?? "Listing rejected.");
            const submission = res.body.submission;
            if (submission) {
                setResults((prev) =>
                    prev.map((item) => (item.id === selected.id ? submission : item))
                );
            }
            setRejectOpen(false);
            setSelected(null);
        } catch (error) {
            toast.error("Unable to reject listing", {
                description:
                    error instanceof Error ? error.message : "Check API connectivity and try again.",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-6">
            <ListingRequestsHeader
                filters={filters}
                categories={categories}
                isLoading={isLoading}
                onFiltersChange={handleFiltersChange}
                onReset={resetFilters}
            />

            <ListingRequestsTable
                requests={results}
                isLoading={isLoading || isUpdating}
                onApprove={handleApprove}
                onReject={handleRejectClick}
            />

            <ListingPagination
                page={page}
                totalPages={totalPages}
                isLoading={isLoading}
                onPageChange={setPage}
            />

            <ListingRequestRejectDialog
                open={rejectOpen}
                isLoading={isUpdating}
                onOpenChange={setRejectOpen}
                onConfirm={handleReject}
            />
        </div>
    );
};

export default ListingRequests;
