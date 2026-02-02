"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { getAdCreative, listAdCreatives, listAdPlacements } from "@/api/ads";
import type { AdCreative, AdPlacement } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import {
    AdCreativeCreateDialog,
    AdCreativeDeleteDialog,
    AdCreativeDetailsDialog,
    AdCreativeEditDialog,
    type AdCreativesFiltersState,
    AdCreativesHeader,
    AdCreativesPagination,
    AdCreativesTable,
} from "@/components/shared/ads/creatives";
import { defaultAdCreativesFilters } from "@/components/shared/ads/creatives/AdCreativesFilters";

const PAGE_SIZE = 10;

const AdCreativesPage = () => {
    const [creatives, setCreatives] = useState<AdCreative[]>([]);
    const [placements, setPlacements] = useState<AdPlacement[]>([]);
    const [filters, setFilters] = useState<AdCreativesFiltersState>(defaultAdCreativesFilters);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedCreative, setSelectedCreative] = useState<AdCreative | null>(null);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to access creatives.",
            });
            return;
        }

        setIsLoading(true);
        Promise.all([
            listAdCreatives({ apiBaseUrl, accessToken: tokens.access }),
            listAdPlacements({ apiBaseUrl, accessToken: tokens.access }),
        ])
            .then(([creativesResult, placementsResult]) => {
                if (creativesResult.ok && creativesResult.body) {
                    setCreatives(creativesResult.body);
                } else {
                    toast.error("Unable to load creatives", {
                        description: "Please try again.",
                    });
                }

                if (placementsResult.ok && placementsResult.body) {
                    setPlacements(placementsResult.body);
                }
            })
            .catch((error: Error) => {
                toast.error("Unable to load creatives", {
                    description: error.message ?? "Check API connectivity and try again.",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [apiBaseUrl]);

    const filteredCreatives = useMemo(() => {
        const search = filters.search.trim().toLowerCase();

        const filtered = creatives.filter((creative) => {
            const matchesSearch =
                !search ||
                creative.title?.toLowerCase().includes(search) ||
                creative.placement_key?.toLowerCase().includes(search);

            const matchesStatus =
                filters.isActive === "all" || creative.is_active === (filters.isActive === "true");

            const matchesPlacement =
                filters.placement === "all" || creative.placement_key === filters.placement;

            return matchesSearch && matchesStatus && matchesPlacement;
        });

        return [...filtered].sort((a, b) => {
            const aTime = a.starts_at ? new Date(a.starts_at).getTime() : 0;
            const bTime = b.starts_at ? new Date(b.starts_at).getTime() : 0;
            return filters.sort === "asc" ? aTime - bTime : bTime - aTime;
        });
    }, [creatives, filters]);

    const totalPages = Math.max(Math.ceil(filteredCreatives.length / PAGE_SIZE), 1);

    const pagedCreatives = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredCreatives.slice(start, start + PAGE_SIZE);
    }, [filteredCreatives, page]);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const resetFilters = () => {
        setFilters(defaultAdCreativesFilters);
        setPage(1);
    };

    const handleFiltersChange = (next: AdCreativesFiltersState) => {
        setFilters(next);
        setPage(1);
    };

    const loadCreativeDetails = async (creative: AdCreative) => {
        if (!creative.id) {
            setSelectedCreative(creative);
            return creative;
        }

        const tokens = authStorage.getTokens();
        if (!tokens?.access) return creative;

        try {
            const result = await getAdCreative({
                apiBaseUrl,
                accessToken: tokens.access,
                creativeId: creative.id,
            });

            if (result.ok && result.body) {
                setSelectedCreative(result.body);
                return result.body;
            }
        } catch {
            // ignore and fall back
        }

        setSelectedCreative(creative);
        return creative;
    };

    const openCreateDialog = () => setCreateOpen(true);

    const openEditDialog = async (creative: AdCreative) => {
        const detailed = await loadCreativeDetails(creative);
        setSelectedCreative(detailed);
        setEditOpen(true);
    };

    const openDeleteDialog = (creative: AdCreative) => {
        setSelectedCreative(creative);
        setDeleteOpen(true);
    };

    const openDetailsDialog = async (creative: AdCreative) => {
        const detailed = await loadCreativeDetails(creative);
        setSelectedCreative(detailed);
        setDetailsOpen(true);
    };

    return (
        <div className="space-y-6">
            <AdCreativesHeader
                isLoading={isLoading}
                onCreate={openCreateDialog}
                filters={filters}
                placements={placements}
                onFiltersChange={handleFiltersChange}
                onReset={resetFilters}
            />

            <AdCreativesTable
                creatives={pagedCreatives}
                isLoading={isLoading}
                onView={openDetailsDialog}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
            />

            <AdCreativesPagination
                page={page}
                totalPages={totalPages}
                isLoading={isLoading}
                onPageChange={setPage}
            />

            <AdCreativeCreateDialog
                open={createOpen}
                placements={placements}
                onOpenChange={setCreateOpen}
                onCreated={(creative) => setCreatives((prev) => [creative, ...prev])}
            />

            <AdCreativeEditDialog
                creative={selectedCreative}
                placements={placements}
                open={editOpen}
                onOpenChange={setEditOpen}
                onUpdated={(updated) =>
                    setCreatives((prev) =>
                        prev.map((item) => (item.id === updated.id ? updated : item))
                    )
                }
            />

            <AdCreativeDeleteDialog
                creative={selectedCreative}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onDeleted={(creativeId) =>
                    setCreatives((prev) => prev.filter((item) => item.id !== creativeId))
                }
            />

            <AdCreativeDetailsDialog
                creativeId={selectedCreative?.id ?? null}
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
            />
        </div>
    );
};

export default AdCreativesPage;
