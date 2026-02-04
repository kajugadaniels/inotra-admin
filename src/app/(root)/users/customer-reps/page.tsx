"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import {
    createCustomerRep,
    deleteCustomerRep,
    listCustomerReps,
    toggleCustomerRepActive,
} from "@/api/users/customer-reps";
import type { AdminUser } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import {
    CustomerRepDeleteDialog,
    CustomerRepHeader,
    CustomerRepPagination,
    CustomerRepTable,
    defaultCustomerRepFilters,
    CustomerRepCreateDialog,
    type CustomerRepForm,
    type CustomerRepFiltersState,
} from "@/components/shared/customer-reps";

const CustomerRepsPage = () => {
    const [filters, setFilters] = useState<CustomerRepFiltersState>({
        ...defaultCustomerRepFilters,
    });
    const [page, setPage] = useState(1);
    const [results, setResults] = useState<AdminUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState(defaultCustomerRepFilters.search);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filters.search);
        }, 350);

        return () => clearTimeout(timer);
    }, [filters.search]);

    useEffect(() => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to access customer reps.",
            });
            return;
        }

        setIsLoading(true);

        listCustomerReps({
            apiBaseUrl,
            accessToken: tokens.access,
            search: debouncedSearch || undefined,
            ordering: filters.ordering,
            sort: filters.sort,
            is_active: filters.isActive === "all" ? undefined : filters.isActive === "true",
            page,
        })
            .then((result) => {
                if (!result.ok || !result.body) {
                    toast.error("Unable to load customer reps", {
                        description: extractErrorDetail(result.body) || "Please try again.",
                    });
                    return;
                }

                setResults(result.body.results ?? []);
                setCount(result.body.count ?? 0);
            })
            .catch((error: Error) => {
                toast.error("Unable to load customer reps", {
                    description: error.message ?? "Check API connectivity and try again.",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [apiBaseUrl, debouncedSearch, filters.ordering, filters.sort, filters.isActive, page]);

    const totalPages = Math.max(Math.ceil(count / 10), 1);

    const handleFiltersChange = (next: CustomerRepFiltersState) => {
        setFilters(next);
        setPage(1);
    };

    const handleReset = () => {
        setFilters({ ...defaultCustomerRepFilters });
        setPage(1);
    };

    const tokens = authStorage.getTokens();

    const handleToggleActive = async (user: AdminUser) => {
        if (!user.id || !tokens?.access) return;
        setBusyId(user.id);
        try {
            const res = await toggleCustomerRepActive({
                apiBaseUrl,
                accessToken: tokens.access,
                userId: user.id,
            });
            const body = res.body as { user?: AdminUser } | null;
            if (!res.ok || !body?.user) {
                toast.error("Update failed", { description: extractErrorDetail(res.body) });
                return;
            }
            const updated = body.user;
            setResults((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        } catch (error) {
            toast.error("Update failed", {
                description: error instanceof Error ? error.message : "Check API connectivity.",
            });
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = async () => {
        if (!selectedUser?.id || !tokens?.access) return;
        setBusyId(selectedUser.id);
        try {
            const res = await deleteCustomerRep({
                apiBaseUrl,
                accessToken: tokens.access,
                userId: selectedUser.id,
            });
            if (!res.ok) {
                toast.error("Delete failed", { description: extractErrorDetail(res.body) });
                return;
            }
            setResults((prev) => prev.filter((u) => u.id !== selectedUser.id));
            setDeleteOpen(false);
            setSelectedUser(null);
            toast.success("Customer rep deleted");
        } catch (error) {
            toast.error("Delete failed", {
                description: error instanceof Error ? error.message : "Check API connectivity.",
            });
        } finally {
            setBusyId(null);
        }
    };

    const handleCreate = async (data: CustomerRepForm, close: () => void, reset: () => void) => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to create customer reps.",
            });
            return;
        }
        setBusyId("create");
        try {
            const res = await createCustomerRep({
                apiBaseUrl,
                accessToken: tokens.access,
                email: data.email.trim(),
                first_name: data.first_name?.trim() || undefined,
                last_name: data.last_name?.trim() || undefined,
                phone: data.phone?.trim() || undefined,
            });
            const body = res.body as { user?: AdminUser } | null;
            if (!res.ok || !body?.user) {
                toast.error("Creation failed", { description: extractErrorDetail(res.body) });
                return;
            }
            const created = body.user;
            setResults((prev) => [created, ...prev]);
            setCount((c) => c + 1);
            toast.success("Customer rep created", { description: "Verification email sent." });
            close();
            reset();
        } catch (error) {
            toast.error("Creation failed", {
                description: error instanceof Error ? error.message : "Check API connectivity.",
            });
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="space-y-6">
            <CustomerRepHeader
                filters={filters}
                isLoading={isLoading}
                onFiltersChange={handleFiltersChange}
                onReset={handleReset}
                onCreate={() => setCreateOpen(true)}
            />

            <CustomerRepCreateDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                isLoading={busyId === "create"}
                onCreate={handleCreate}
            />

            <CustomerRepTable
                reps={results}
                isLoading={isLoading}
                busyId={busyId}
                onToggleActive={handleToggleActive}
                onDelete={(user) => {
                    setSelectedUser(user);
                    setDeleteOpen(true);
                }}
            />

            <CustomerRepPagination
                page={page}
                totalPages={totalPages}
                isLoading={isLoading}
                onPageChange={setPage}
            />

            <CustomerRepDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDelete}
                isLoading={busyId === selectedUser?.id}
                userLabel={selectedUser?.name || selectedUser?.email || selectedUser?.username || "user"}
            />
        </div>
    );
};

export default CustomerRepsPage;
