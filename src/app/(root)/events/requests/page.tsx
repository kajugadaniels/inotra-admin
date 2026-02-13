"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import {
    listEventSubmissions,
    updateEventSubmissionStatus,
} from "@/api/events";
import type { EventSubmissionListItem } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import ListingPagination from "@/components/shared/listings/ListingPagination";
import {
    EventRequestRejectDialog,
    EventRequestsHeader,
    EventRequestsTable,
    defaultEventRequestFilters,
    type EventRequestFiltersState,
} from "@/components/shared/events/requests";

const EventRequestsPage = () => {
    const [filters, setFilters] = useState<EventRequestFiltersState>(defaultEventRequestFilters);
    const [page, setPage] = useState(1);
    const [results, setResults] = useState<EventSubmissionListItem[]>([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState<EventSubmissionListItem | null>(null);
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
                description: "Sign in again to access event requests.",
            });
            return;
        }

        setIsLoading(true);
        listEventSubmissions({
            apiBaseUrl,
            accessToken: tokens.access,
            search: debouncedSearch || undefined,
            status: filters.status === "all" ? undefined : filters.status,
            city: filters.city || undefined,
            country: filters.country || undefined,
            ordering: filters.ordering,
            sort: filters.sort,
            page,
            page_size: 20,
        })
            .then((result) => {
                if (!result.ok || !result.body) {
                    toast.error("Unable to load event requests", {
                        description: extractErrorDetail(result.body) || "Please try again.",
                    });
                    return;
                }
                setResults(result.body.results ?? []);
                setCount(result.body.count ?? 0);
            })
            .catch((error: Error) => {
                toast.error("Unable to load event requests", {
                    description: error.message ?? "Check API connectivity and try again.",
                });
            })
            .finally(() => setIsLoading(false));
    }, [
        apiBaseUrl,
        debouncedSearch,
        filters.status,
        filters.city,
        filters.country,
        filters.ordering,
        filters.sort,
        page,
    ]);

    const totalPages = Math.max(Math.ceil(count / 20), 1);

    const resetFilters = () => {
        setFilters(defaultEventRequestFilters);
        setPage(1);
    };

    const handleFiltersChange = (next: EventRequestFiltersState) => {
        setFilters(next);
        setPage(1);
    };

    const handleApprove = async (request: EventSubmissionListItem) => {
        if (!request.id) return;
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to update event requests.",
            });
            return;
        }

        setIsUpdating(true);
        try {
            const res = await updateEventSubmissionStatus({
                apiBaseUrl,
                accessToken: tokens.access,
                submissionId: request.id,
                status: "APPROVED",
            });

            if (!res.ok || !res.body) {
                toast.error("Unable to approve event", {
                    description: extractErrorDetail(res.body) || "Please try again.",
                });
                return;
            }

            toast.success(res.body.message ?? "Event approved.");
            const submission = res.body.submission;
            if (submission) {
                setResults((prev) =>
                    prev.map((item) => (item.id === request.id ? submission : item))
                );
            }
        } catch (error) {
            toast.error("Unable to approve event", {
                description:
                    error instanceof Error ? error.message : "Check API connectivity and try again.",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRejectClick = (request: EventSubmissionListItem) => {
        setSelected(request);
        setRejectOpen(true);
    };

    const handleReject = async (reason: string) => {
        if (!selected?.id) return;
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to update event requests.",
            });
            return;
        }

        setIsUpdating(true);
        try {
            const res = await updateEventSubmissionStatus({
                apiBaseUrl,
                accessToken: tokens.access,
                submissionId: selected.id,
                status: "REJECTED",
                rejection_reason: reason,
            });

            if (!res.ok || !res.body) {
                toast.error("Unable to reject event", {
                    description: extractErrorDetail(res.body) || "Please try again.",
                });
                return;
            }

            toast.success(res.body.message ?? "Event rejected.");
            const submission = res.body.submission;
            if (submission) {
                setResults((prev) =>
                    prev.map((item) => (item.id === selected.id ? submission : item))
                );
            }
            setRejectOpen(false);
            setSelected(null);
        } catch (error) {
            toast.error("Unable to reject event", {
                description:
                    error instanceof Error ? error.message : "Check API connectivity and try again.",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-6">
            <EventRequestsHeader
                filters={filters}
                isLoading={isLoading}
                onFiltersChange={handleFiltersChange}
                onReset={resetFilters}
            />

            <EventRequestsTable
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

            <EventRequestRejectDialog
                open={rejectOpen}
                isLoading={isUpdating}
                onOpenChange={setRejectOpen}
                onConfirm={handleReject}
            />
        </div>
    );
};

export default EventRequestsPage;

