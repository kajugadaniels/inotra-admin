"use client";

import { useEffect, useMemo, useState } from "react";

import type { AdPlacement } from "@/api/types";
import {
    AdPlacementsFilters,
    type AdPlacementsFiltersState,
    AdPlacementsHeader,
    AdPlacementsPagination,
    AdPlacementsTable,
} from "@/components/shared/ads/placements";
import { useAdPlacementsData } from "@/components/shared/ads/placements/AdPlacementsData";
import AdPlacementCreateDialog from "@/components/shared/ads/placements/AdPlacementCreateDialog";
import AdPlacementEditDialog from "@/components/shared/ads/placements/AdPlacementEditDialog";
import AdPlacementDeleteDialog from "@/components/shared/ads/placements/AdPlacementDeleteDialog";
import AdPlacementDetailsDialog from "@/components/shared/ads/placements/AdPlacementDetailsDialog";

const PAGE_SIZE = 10;

const DEFAULT_FILTERS: AdPlacementsFiltersState = {
    search: "",
    sort: "desc",
    isActive: "all",
};

const AdPlacementsPage = () => {
    const { placements, setPlacements, isLoading } = useAdPlacementsData();

    const [filters, setFilters] = useState<AdPlacementsFiltersState>(DEFAULT_FILTERS);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedPlacement, setSelectedPlacement] = useState<AdPlacement | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput }));
            setPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const filteredPlacements = useMemo(() => {
        const search = filters.search.trim().toLowerCase();

        const filtered = placements.filter((placement) => {
            const matchesSearch =
                !search ||
                placement.key?.toLowerCase().includes(search) ||
                placement.title?.toLowerCase().includes(search);
            const matchesStatus =
                filters.isActive === "all" ||
                placement.is_active === (filters.isActive === "true");

            return matchesSearch && matchesStatus;
        });

        return [...filtered].sort((a, b) => {
            const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
            const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
            return filters.sort === "asc" ? aTime - bTime : bTime - aTime;
        });
    }, [filters, placements]);

    const totalPages = Math.max(Math.ceil(filteredPlacements.length / PAGE_SIZE), 1);
    const pagedPlacements = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredPlacements.slice(start, start + PAGE_SIZE);
    }, [filteredPlacements, page]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const resetFilters = () => {
        setFilters(DEFAULT_FILTERS);
        setSearchInput("");
        setPage(1);
    };

    const openCreateDialog = () => setCreateOpen(true);
    const openEditDialog = (placement: AdPlacement) => {
        setSelectedPlacement(placement);
        setEditOpen(true);
    };
    const openDeleteDialog = (placement: AdPlacement) => {
        setSelectedPlacement(placement);
        setDeleteOpen(true);
    };
    const openDetailsDialog = (placement: AdPlacement) => {
        setSelectedPlacement(placement);
        setDetailsOpen(true);
    };

    return (
        <div className="space-y-6">
            <AdPlacementsHeader isLoading={isLoading} onCreate={openCreateDialog} />

            <AdPlacementsFilters
                filters={{ ...filters, search: searchInput }}
                isLoading={isLoading}
                onFiltersChange={(next) => {
                    setFilters(next);
                    setSearchInput(next.search);
                    setPage(1);
                }}
                onReset={resetFilters}
            />

            <AdPlacementsTable
                placements={pagedPlacements}
                isLoading={isLoading}
                onView={openDetailsDialog}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
            />

            <AdPlacementsPagination
                page={page}
                totalPages={totalPages}
                isLoading={isLoading}
                onPageChange={setPage}
            />

            <AdPlacementCreateDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onCreated={(placement) => setPlacements((prev) => [placement, ...prev])}
            />

            <AdPlacementEditDialog
                placement={selectedPlacement}
                open={editOpen}
                onOpenChange={setEditOpen}
                onUpdated={(updated) =>
                    setPlacements((prev) =>
                        prev.map((item) => (item.id === updated.id ? updated : item))
                    )
                }
            />

            <AdPlacementDeleteDialog
                placement={selectedPlacement}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onDeleted={(placementId) =>
                    setPlacements((prev) => prev.filter((item) => item.id !== placementId))
                }
            />

            <AdPlacementDetailsDialog
                placementId={selectedPlacement?.id ?? null}
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
            />
        </div>
    );
};

export default AdPlacementsPage;
