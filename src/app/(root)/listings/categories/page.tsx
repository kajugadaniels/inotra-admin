"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { listPlaceCategories } from "@/api/places";
import type { PlaceCategory } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import {
    ListingCategoryCreateDialog,
    ListingCategoryDeleteDialog,
    ListingCategoryDetailsDialog,
    ListingCategoryEditDialog,
    ListingCategoriesHeader,
    ListingCategoriesPagination,
    ListingCategoriesTable,
} from "@/components/shared/listings/categories";
import {
    defaultListingCategoriesFilters,
    type ListingCategoriesFiltersState,
} from "@/components/shared/listings/categories/ListingCategoriesFilters";

const PAGE_SIZE = 10;

const ListingCategoriesPage = () => {
    const [categories, setCategories] = useState<PlaceCategory[]>([]);
    const [filters, setFilters] = useState<ListingCategoriesFiltersState>(
        defaultListingCategoriesFilters
    );
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | null>(null);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to access listing categories.",
            });
            return;
        }

        setIsLoading(true);
        listPlaceCategories({ apiBaseUrl, accessToken: tokens.access })
            .then((result) => {
                if (!result.ok || !result.body) {
                    toast.error("Unable to load listing categories", {
                        description: "Please try again.",
                    });
                    return;
                }
                setCategories(result.body);
            })
            .catch((error: Error) => {
                toast.error("Unable to load listing categories", {
                    description: error.message ?? "Check API connectivity and try again.",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [apiBaseUrl]);

    const filteredCategories = useMemo(() => {
        const search = filters.search.trim().toLowerCase();

        const filtered = categories.filter((category) => {
            const matchesSearch =
                !search ||
                category.name?.toLowerCase().includes(search) ||
                category.icon?.toLowerCase().includes(search);

            const matchesStatus =
                filters.isActive === "all" ||
                category.is_active === (filters.isActive === "true");

            return matchesSearch && matchesStatus;
        });

        return [...filtered].sort((a, b) => {
            const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
            const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
            return filters.sort === "asc" ? aTime - bTime : bTime - aTime;
        });
    }, [categories, filters]);

    const totalPages = Math.max(Math.ceil(filteredCategories.length / PAGE_SIZE), 1);
    const pagedCategories = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredCategories.slice(start, start + PAGE_SIZE);
    }, [filteredCategories, page]);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const resetFilters = () => {
        setFilters(defaultListingCategoriesFilters);
        setPage(1);
    };

    const handleFiltersChange = (next: ListingCategoriesFiltersState) => {
        setFilters(next);
        setPage(1);
    };

    const openCreateDialog = () => setCreateOpen(true);
    const openEditDialog = (category: PlaceCategory) => {
        setSelectedCategory(category);
        setEditOpen(true);
    };
    const openDeleteDialog = (category: PlaceCategory) => {
        setSelectedCategory(category);
        setDeleteOpen(true);
    };
    const openDetailsDialog = (category: PlaceCategory) => {
        setSelectedCategory(category);
        setDetailsOpen(true);
    };

    return (
        <div className="space-y-6">
            <ListingCategoriesHeader
                filters={filters}
                isLoading={isLoading}
                onFiltersChange={handleFiltersChange}
                onReset={resetFilters}
                onCreate={openCreateDialog}
            />

            <ListingCategoriesTable
                categories={pagedCategories}
                isLoading={isLoading}
                onView={openDetailsDialog}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
            />

            <ListingCategoriesPagination
                page={page}
                totalPages={totalPages}
                isLoading={isLoading}
                onPageChange={setPage}
            />

            <ListingCategoryCreateDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onCreated={(category) => setCategories((prev) => [category, ...prev])}
            />

            <ListingCategoryEditDialog
                category={selectedCategory}
                open={editOpen}
                onOpenChange={setEditOpen}
                onUpdated={(updated) =>
                    setCategories((prev) =>
                        prev.map((item) => (item.id === updated.id ? updated : item))
                    )
                }
            />

            <ListingCategoryDeleteDialog
                category={selectedCategory}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onDeleted={(categoryId) =>
                    setCategories((prev) => prev.filter((item) => item.id !== categoryId))
                }
            />

            <ListingCategoryDetailsDialog
                category={selectedCategory}
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
            />
        </div>
    );
};

export default ListingCategoriesPage;
