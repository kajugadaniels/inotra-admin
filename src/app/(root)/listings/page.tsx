"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { listPlaceCategories, listPlaces } from "@/api/places";
import type { PlaceCategory, PlaceListItem } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import {
    ListingDeleteDialog,
    type ListingFiltersState,
    ListingHeader,
    ListingPagination,
    ListingTable,
} from "@/components/shared/listings";
import { defaultListingFilters } from "@/components/shared/listings/ListingFilters";

const ListingsPage = () => {
    const [filters, setFilters] = useState<ListingFiltersState>(defaultListingFilters);
    const [page, setPage] = useState(1);
    const [results, setResults] = useState<PlaceListItem[]>([]);
    const [count, setCount] = useState(0);
    const [categories, setCategories] = useState<PlaceCategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState<PlaceListItem | null>(null);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    // Debounce only API search term, not input typing
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(filters.search), 350);
        return () => clearTimeout(timer);
    }, [filters.search]);

    useEffect(() => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to access listings.",
            });
            return;
        }

        setIsLoading(true);

        Promise.all([
            listPlaces({
                apiBaseUrl,
                accessToken: tokens.access,
                search: debouncedSearch || undefined,
                ordering: filters.ordering,
                sort: filters.sort,
                category: filters.category === "all" ? undefined : filters.category,
                is_active: filters.isActive === "all" ? undefined : filters.isActive === "true",
                is_verified: filters.isVerified === "all" ? undefined : filters.isVerified === "true",
                page,
            }),
            listPlaceCategories({ apiBaseUrl, accessToken: tokens.access }),
        ])
            .then(([listingsResult, categoriesResult]) => {
                if (listingsResult.ok && listingsResult.body) {
                    setResults(listingsResult.body.results ?? []);
                    setCount(listingsResult.body.count ?? 0);
                } else {
                    toast.error("Unable to load listings", {
                        description: extractErrorDetail(listingsResult.body) || "Please try again.",
                    });
                }

                if (categoriesResult.ok && categoriesResult.body) {
                    setCategories(categoriesResult.body);
                }
            })
            .catch((error: Error) => {
                toast.error("Unable to load listings", {
                    description: error.message ?? "Check API connectivity and try again.",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [apiBaseUrl, debouncedSearch, filters.ordering, filters.sort, filters.category, filters.isActive, filters.isVerified, page]);

    const totalPages = Math.max(Math.ceil(count / 10), 1);

    const resetFilters = () => {
        setFilters(defaultListingFilters);
        setPage(1);
    };

    const handleFiltersChange = (next: ListingFiltersState) => {
        setFilters(next);
        setPage(1);
    };

    const openDeleteDialog = (listing: PlaceListItem) => {
        setSelectedListing(listing);
        setDeleteOpen(true);
    };

    return (
        <div className="space-y-6">
            <ListingHeader
                filters={filters}
                categories={categories}
                isLoading={isLoading}
                onFiltersChange={handleFiltersChange}
                onReset={resetFilters}
            />

            <ListingTable listings={results} isLoading={isLoading} onDelete={openDeleteDialog} />

            <ListingPagination
                page={page}
                totalPages={totalPages}
                isLoading={isLoading}
                onPageChange={setPage}
            />

            <ListingDeleteDialog
                listing={selectedListing}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onDeleted={(listingId) =>
                    setResults((prev) => prev.filter((item) => item.id !== listingId))
                }
            />
        </div>
    );
};

export default ListingsPage;
