"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import {
    deletePackage,
    listPackages,
    togglePackageActive,
    type PackageListItem,
} from "@/api/packages";
import { getApiBaseUrl } from "@/config/api";
import TripPackagesHeader from "@/components/trip-packages/TripPackagesHeader";
import type { TripPackagesFiltersState } from "@/components/trip-packages/TripPackagesFilters";
import TripPackageDeleteDialog from "@/components/trip-packages/TripPackageDeleteDialog";
import TripPackagesTable from "@/components/trip-packages/TripPackagesTable";

const PAGE_SIZE = 10;

const uniqById = (prev: PackageListItem[], next: PackageListItem[]) => {
    const map = new Map<string, PackageListItem>();
    for (const item of prev) {
        if (item.id) map.set(item.id, item);
    }
    for (const item of next) {
        if (item.id) map.set(item.id, item);
    }
    return Array.from(map.values());
};

const TripPackagesPage = () => {
    const router = useRouter();
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const [filters, setFilters] = useState<TripPackagesFiltersState>({
        search: "",
        ordering: "created_at",
        sort: "desc",
        isActive: "all",
    });
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [items, setItems] = useState<PackageListItem[]>([]);
    const [count, setCount] = useState(0);

    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const [selected, setSelected] = useState<PackageListItem | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(filters.search.trim()), 350);
        return () => clearTimeout(t);
    }, [filters.search]);

    const apiOrdering = useMemo(() => {
        const base = filters.ordering;
        return filters.sort === "desc" ? (`-${base}` as const) : base;
    }, [filters.ordering, filters.sort]);

    const apiIsActive = useMemo(() => {
        if (filters.isActive === "all") return undefined;
        return filters.isActive === "true";
    }, [filters.isActive]);

    const loadPage = useCallback(
        async (targetPage: number, mode: "replace" | "append") => {
            const tokens = authStorage.getTokens();
            if (!tokens?.access) {
                toast.error("Session missing", {
                    description: "Sign in again to access packages.",
                });
                return;
            }

            const setLoading = mode === "replace" ? setIsLoading : setIsLoadingMore;
            setLoading(true);

            try {
                const res = await listPackages({
                    apiBaseUrl,
                    accessToken: tokens.access,
                    search: debouncedSearch || undefined,
                    is_active: apiIsActive,
                    ordering: apiOrdering,
                    page: targetPage,
                });

                if (!res.ok || !res.body) {
                    toast.error("Unable to load packages", {
                        description: extractErrorDetail(res.body) || "Please try again.",
                    });
                    return;
                }

                const nextResults = res.body.results ?? [];
                setCount(res.body.count ?? 0);

                const apiHasNext =
                    Boolean(res.body.next) || targetPage * PAGE_SIZE < (res.body.count ?? 0);
                setHasNext(apiHasNext);

                if (mode === "replace") {
                    setItems(nextResults);
                    setPage(targetPage);
                } else {
                    setItems((prev) => uniqById(prev, nextResults));
                    setPage(targetPage);
                }
            } catch (error) {
                toast.error("Unable to load packages", {
                    description: error instanceof Error ? error.message : "Check API connectivity.",
                });
            } finally {
                setLoading(false);
            }
        },
        [apiBaseUrl, apiIsActive, apiOrdering, debouncedSearch]
    );

    useEffect(() => {
        loadPage(1, "replace");
    }, [loadPage]);

    const loadMore = useCallback(async () => {
        if (isLoading || isLoadingMore || !hasNext) return;
        await loadPage(page + 1, "append");
    }, [hasNext, isLoading, isLoadingMore, loadPage, page]);

    // Infinite scroll sentinel
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        if (!hasNext) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) loadMore();
            },
            { root: null, rootMargin: "600px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNext, loadMore]);

    const onReset = () => {
        setFilters({
            search: "",
            ordering: "created_at",
            sort: "desc",
            isActive: "all",
        });
    };

    const handleToggleActive = useCallback(
        async (pkg: PackageListItem) => {
            const packageId = pkg.id;
            if (!packageId) return;
            const tokens = authStorage.getTokens();
            if (!tokens?.access) {
                toast.error("Session missing", { description: "Sign in again to update packages." });
                return;
            }
            setBusyId(packageId);
            try {
                const res = await togglePackageActive({
                    apiBaseUrl,
                    accessToken: tokens.access,
                    packageId,
                });
                const payload = res.body as { package?: PackageListItem; message?: string } | null;
                if (!res.ok || !payload?.package) {
                    toast.error("Update failed", { description: extractErrorDetail(res.body) });
                    return;
                }
                setItems((prev) =>
                    prev.map((item) => (item.id === packageId ? { ...item, ...payload.package } : item))
                );
                toast.success("Package updated", { description: payload.message ?? "Status updated." });
            } catch (error) {
                toast.error("Update failed", {
                    description: error instanceof Error ? error.message : "Check API connectivity.",
                });
            } finally {
                setBusyId(null);
            }
        },
        [apiBaseUrl]
    );

    const handleDelete = useCallback(async () => {
        const packageId = selected?.id;
        if (!packageId) return;
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", { description: "Sign in again to delete packages." });
            return;
        }
        setBusyId(packageId);
        try {
            const res = await deletePackage({
                apiBaseUrl,
                accessToken: tokens.access,
                packageId,
            });
            if (!res.ok) {
                toast.error("Delete failed", { description: extractErrorDetail(res.body) });
                return;
            }
            setItems((prev) => prev.filter((item) => item.id !== packageId));
            setCount((prev) => Math.max(prev - 1, 0));
            setDeleteOpen(false);
            setSelected(null);
            toast.success("Package deleted");
        } catch (error) {
            toast.error("Delete failed", {
                description: error instanceof Error ? error.message : "Check API connectivity.",
            });
        } finally {
            setBusyId(null);
        }
    }, [apiBaseUrl, selected?.id]);

    return (
        <div className="space-y-6">
            <TripPackagesHeader
                filters={filters}
                count={count}
                isLoading={isLoading}
                onFiltersChange={(next) => {
                    setFilters(next);
                }}
                onReset={onReset}
            />

            <TripPackagesTable
                packages={items}
                isLoading={isLoading}
                busyId={busyId}
                onView={(pkg) => {
                    if (!pkg.id) return;
                    router.push(`/trip-packages/${pkg.id}`);
                }}
                onEdit={(pkg) => {
                    if (!pkg.id) return;
                    router.push(`/trip-packages/${pkg.id}/edit`);
                }}
                onDelete={(pkg) => {
                    setSelected(pkg);
                    setDeleteOpen(true);
                }}
                onToggleActive={handleToggleActive}
            />

            {/* sentinel */}
            <div ref={sentinelRef} className="h-8" />

            {!hasNext && items.length > 0 ? (
                <div className="text-center text-xs text-muted-foreground">
                    You&apos;re all caught up.
                </div>
            ) : null}

            <TripPackageDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDelete}
                isLoading={busyId === selected?.id}
                label={selected?.title ?? "package"}
            />
        </div>
    );
};

export default TripPackagesPage;
