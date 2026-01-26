"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import {
    createAdPlacement,
    deleteAdPlacement,
    listAdPlacements,
    updateAdPlacement,
} from "@/api/ads";
import type { AdPlacement } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import {
    AdPlacementsFilters,
    type AdPlacementsFiltersState,
    AdPlacementsHeader,
    AdPlacementsPagination,
    AdPlacementsTable,
} from "@/components/shared/ads/placements";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PAGE_SIZE = 10;

const DEFAULT_FILTERS: AdPlacementsFiltersState = {
    search: "",
    sort: "desc",
    isActive: "all",
};

const AdPlacementsPage = () => {
    const [placements, setPlacements] = useState<AdPlacement[]>([]);
    const [filters, setFilters] = useState<AdPlacementsFiltersState>(DEFAULT_FILTERS);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [activePlacement, setActivePlacement] = useState<AdPlacement | null>(null);

    const [createForm, setCreateForm] = useState({
        key: "",
        title: "",
        is_active: true,
    });
    const [editForm, setEditForm] = useState({
        key: "",
        title: "",
        is_active: true,
    });

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput }));
            setPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to access placements.",
            });
            return;
        }

        setIsLoading(true);
        listAdPlacements({ apiBaseUrl, accessToken: tokens.access })
            .then((result) => {
                if (!result.ok || !result.body) {
                    toast.error("Unable to load placements", {
                        description: "Please try again.",
                    });
                    return;
                }
                setPlacements(result.body);
            })
            .catch((error: Error) => {
                toast.error("Unable to load placements", {
                    description: error.message ?? "Check API connectivity and try again.",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [apiBaseUrl]);

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

        const sorted = [...filtered].sort((a, b) => {
            const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
            const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
            return filters.sort === "asc" ? aTime - bTime : bTime - aTime;
        });

        return sorted;
    }, [placements, filters]);

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

    const openCreateDialog = () => {
        setCreateForm({ key: "", title: "", is_active: true });
        setCreateOpen(true);
    };

    const openEditDialog = (placement: AdPlacement) => {
        setActivePlacement(placement);
        setEditForm({
            key: placement.key ?? "",
            title: placement.title ?? "",
            is_active: placement.is_active ?? true,
        });
        setEditOpen(true);
    };

    const openDeleteDialog = (placement: AdPlacement) => {
        setActivePlacement(placement);
        setDeleteOpen(true);
    };

    const handleCreate = async () => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to create placements.",
            });
            return;
        }

        const key = createForm.key.trim();
        if (!key) {
            toast.error("Placement key required", {
                description: "Provide a unique key for the placement.",
            });
            return;
        }

        setIsLoading(true);
        try {
            const result = await createAdPlacement({
                apiBaseUrl,
                accessToken: tokens.access,
                data: {
                    key,
                    title: createForm.title.trim() || undefined,
                    is_active: createForm.is_active,
                },
            });

            if (!result.ok || !result.body) {
                toast.error("Placement creation failed", {
                    description: result.body?.message ?? "Please review the form and retry.",
                });
                return;
            }

            if (result.body?.placement) {
                setPlacements((prev) => [result.body.placement, ...prev]);
            }
            setCreateOpen(false);
            toast.success("Placement created", {
                description: result.body?.message ?? "Ad placement added successfully.",
            });
        } catch (error) {
            toast.error("Placement creation failed", {
                description:
                    error instanceof Error ? error.message : "Check API connectivity and try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access || !activePlacement?.id) {
            toast.error("Session missing", {
                description: "Sign in again to update placements.",
            });
            return;
        }

        const key = editForm.key.trim();
        if (!key) {
            toast.error("Placement key required", {
                description: "Provide a unique key for the placement.",
            });
            return;
        }

        setIsLoading(true);
        try {
            const result = await updateAdPlacement({
                apiBaseUrl,
                accessToken: tokens.access,
                placementId: activePlacement.id,
                data: {
                    key,
                    title: editForm.title.trim() || undefined,
                    is_active: editForm.is_active,
                },
            });

            if (!result.ok || !result.body) {
                toast.error("Placement update failed", {
                    description: result.body?.message ?? "Please try again.",
                });
                return;
            }

            if (result.body?.placement) {
                setPlacements((prev) =>
                    prev.map((item) =>
                        item.id === activePlacement.id ? result.body.placement : item
                    )
                );
            }
            setEditOpen(false);
            toast.success("Placement updated", {
                description: result.body?.message ?? "Placement updated successfully.",
            });
        } catch (error) {
            toast.error("Placement update failed", {
                description:
                    error instanceof Error ? error.message : "Check API connectivity and try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access || !activePlacement?.id) {
            toast.error("Session missing", {
                description: "Sign in again to delete placements.",
            });
            return;
        }

        setIsLoading(true);
        try {
            const result = await deleteAdPlacement({
                apiBaseUrl,
                accessToken: tokens.access,
                placementId: activePlacement.id,
            });

            if (!result.ok) {
                toast.error("Placement deletion failed", {
                    description: result.body?.message ?? "Please try again.",
                });
                return;
            }

            setPlacements((prev) => prev.filter((item) => item.id !== activePlacement.id));
            setDeleteOpen(false);
            toast.success("Placement deleted", {
                description: result.body?.message ?? "Placement removed successfully.",
            });
        } catch (error) {
            toast.error("Placement deletion failed", {
                description:
                    error instanceof Error ? error.message : "Check API connectivity and try again.",
            });
        } finally {
            setIsLoading(false);
        }
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
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
            />

            <AdPlacementsPagination
                page={page}
                totalPages={totalPages}
                isLoading={isLoading}
                onPageChange={setPage}
            />

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>New ad placement</DialogTitle>
                        <DialogDescription>
                            Create a new placement key for ad inventory.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Placement key
                            </label>
                            <Input
                                value={createForm.key}
                                onChange={(event) =>
                                    setCreateForm((prev) => ({
                                        ...prev,
                                        key: event.target.value,
                                    }))
                                }
                                placeholder="HOME_FEED_TOP"
                                className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Title
                            </label>
                            <Input
                                value={createForm.title}
                                onChange={(event) =>
                                    setCreateForm((prev) => ({
                                        ...prev,
                                        title: event.target.value,
                                    }))
                                }
                                placeholder="Homepage hero banner"
                                className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Status
                            </label>
                            <Select
                                value={createForm.is_active ? "true" : "false"}
                                onValueChange={(value) =>
                                    setCreateForm((prev) => ({
                                        ...prev,
                                        is_active: value === "true",
                                    }))
                                }
                            >
                                <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleCreate} disabled={isLoading}>
                            Create placement
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Edit placement</DialogTitle>
                        <DialogDescription>
                            Update placement metadata and availability.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Placement key
                            </label>
                            <Input
                                value={editForm.key}
                                onChange={(event) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        key: event.target.value,
                                    }))
                                }
                                placeholder="HOME_FEED_TOP"
                                className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Title
                            </label>
                            <Input
                                value={editForm.title}
                                onChange={(event) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        title: event.target.value,
                                    }))
                                }
                                placeholder="Homepage hero banner"
                                className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Status
                            </label>
                            <Select
                                value={editForm.is_active ? "true" : "false"}
                                onValueChange={(value) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        is_active: value === "true",
                                    }))
                                }
                            >
                                <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleUpdate} disabled={isLoading}>
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete placement?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove the placement key. Existing creatives remain but will
                            no longer reference this placement.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Delete placement
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AdPlacementsPage;
