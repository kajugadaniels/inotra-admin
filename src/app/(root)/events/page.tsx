"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { listEvents } from "@/api/events";
import type { EventListItem } from "@/api/events/listEvents";
import { getApiBaseUrl } from "@/config/api";
import {
    EventGrid,
    EventHeader,
    EventPagination,
    defaultEventFilters,
    type EventFiltersState,
} from "@/components/events";

const EventsPage = () => {
    const [filters, setFilters] = useState<EventFiltersState>({ ...defaultEventFilters });
    const [page, setPage] = useState(1);
    const [results, setResults] = useState<EventListItem[]>([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(filters.search), 350);
        return () => clearTimeout(timer);
    }, [filters.search]);

    useEffect(() => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", { description: "Sign in again to access events." });
            return;
        }

        setIsLoading(true);

        listEvents({
            apiBaseUrl,
            accessToken: tokens.access,
            search: debouncedSearch || undefined,
            city: filters.city || undefined,
            country: filters.country || undefined,
            is_active: filters.isActive === "all" ? undefined : filters.isActive === "true",
            is_verified: filters.isVerified === "all" ? undefined : filters.isVerified === "true",
            start_from: filters.startFrom || undefined,
            start_to: filters.startTo || undefined,
            ordering: filters.ordering,
            sort: filters.sort,
            page,
        })
            .then((result) => {
                if (!result.ok || !result.body) {
                    toast.error("Unable to load events", {
                        description: extractErrorDetail(result.body) || "Please try again.",
                    });
                    return;
                }
                setResults(result.body.results ?? []);
                setCount(result.body.count ?? 0);
            })
            .catch((error: Error) => {
                toast.error("Unable to load events", {
                    description: error.message ?? "Check API connectivity and try again.",
                });
            })
            .finally(() => setIsLoading(false));
    }, [
        apiBaseUrl,
        debouncedSearch,
        filters.city,
        filters.country,
        filters.isActive,
        filters.isVerified,
        filters.ordering,
        filters.sort,
        filters.startFrom,
        filters.startTo,
        page,
    ]);

    const totalPages = Math.max(Math.ceil(count / 10), 1);

    const handleFiltersChange = (next: EventFiltersState) => {
        setFilters(next);
        setPage(1);
    };

    const handleReset = () => {
        setFilters({ ...defaultEventFilters });
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <EventHeader
                filters={filters}
                isLoading={isLoading}
                onFiltersChange={handleFiltersChange}
                onReset={handleReset}
            />

            <EventGrid events={results} isLoading={isLoading} />

            <EventPagination
                page={page}
                totalPages={totalPages}
                isLoading={isLoading}
                onPageChange={setPage}
            />
        </div>
    );
};

export default EventsPage;
