"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { extractErrorDetail } from "@/api";
import { deleteUser, getUser, listUsers, updateUserActive } from "@/api/users";
import type { AdminUser } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import {
    UsersHeader,
    UsersPagination,
    UsersTable,
    defaultUsersFilters,
    type UsersFiltersState,
} from "@/components/shared/users";
import UserDeleteDialog from "@/components/shared/users/UserDeleteDialog";
import UserDetailsSheet from "@/components/shared/users/UserDetailsSheet";

const UsersPage = () => {
    const [filters, setFilters] = useState<UsersFiltersState>({ ...defaultUsersFilters });
    const [page, setPage] = useState(1);
    const [results, setResults] = useState<AdminUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Debounce only the API search term (NOT the input)
    const [debouncedSearch, setDebouncedSearch] = useState(defaultUsersFilters.search);

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
                description: "Sign in again to access user data.",
            });
            return;
        }

        setIsLoading(true);

        listUsers({
            apiBaseUrl,
            accessToken: tokens.access,
            search: debouncedSearch ? debouncedSearch : undefined,
            ordering: filters.ordering,
            sort: filters.sort,
            is_active: filters.isActive === "all" ? undefined : filters.isActive === "true",
            page,
        })
            .then((result) => {
                if (!result.ok || !result.body) {
                    toast.error("Unable to load users", {
                        description: result.body?.message ?? "Please try again.",
                    });
                    return;
                }

                setResults(result.body.results ?? []);
                setCount(result.body.count ?? 0);
            })
            .catch((error: Error) => {
                toast.error("Unable to load users", {
                    description: error.message ?? "Check API connectivity and try again.",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [apiBaseUrl, debouncedSearch, filters.ordering, filters.sort, filters.isActive, page]);

    const totalPages = Math.max(Math.ceil(count / 10), 1);

    const handleFiltersChange = (next: UsersFiltersState) => {
        setFilters(next);
        setPage(1);
    };

    const handleReset = () => {
        setFilters(defaultUsersFilters);
        setPage(1);
    };

    const tokens = authStorage.getTokens();

    const handleView = async (user?: AdminUser) => {
        if (!user?.id || !tokens?.access) return;
        setBusyId(user.id);
        try {
            const res = await getUser({ apiBaseUrl, accessToken: tokens.access, userId: user.id });
            if (!res.ok || !res.body || (res.status && res.status >= 400)) {
                toast.error("Unable to load user", { description: extractErrorDetail(res.body) });
                return;
            }
            setSelectedUser(res.body as AdminUser);
            setDetailsOpen(true);
        } catch (error) {
            toast.error("Unable to load user", {
                description: error instanceof Error ? error.message : "Check API connectivity.",
            });
        } finally {
            setBusyId(null);
        }
    };

    const handleToggleActive = async (user: AdminUser) => {
        if (!user.id || !tokens?.access) return;
        setBusyId(user.id);
        try {
            const res = await updateUserActive({ apiBaseUrl, accessToken: tokens.access, userId: user.id });
            if (!res.ok || !res.body || !("user" in res.body)) {
                toast.error("Update failed", { description: extractErrorDetail(res.body) });
                return;
            }
            const updated = (res.body as any).user as AdminUser;
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
            const res = await deleteUser({ apiBaseUrl, accessToken: tokens.access, userId: selectedUser.id });
            if (!res.ok) {
                toast.error("Delete failed", { description: extractErrorDetail(res.body) });
                return;
            }
            setResults((prev) => prev.filter((u) => u.id !== selectedUser.id));
            setDeleteOpen(false);
            setSelectedUser(null);
            toast.success("User deleted");
        } catch (error) {
            toast.error("Delete failed", {
                description: error instanceof Error ? error.message : "Check API connectivity.",
            });
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="space-y-6">
            <UsersHeader
                filters={filters}
                isLoading={isLoading}
                onFiltersChange={handleFiltersChange}
                onReset={handleReset}
            />

            <UsersTable
                users={results}
                isLoading={isLoading}
                busyId={busyId}
                onView={handleView}
                onToggleActive={handleToggleActive}
                onDelete={(user) => {
                    setSelectedUser(user);
                    setDeleteOpen(true);
                }}
            />

            <UsersPagination
                page={page}
                totalPages={totalPages}
                isLoading={isLoading}
                onPageChange={setPage}
            />

            <UserDetailsSheet user={selectedUser} open={detailsOpen} onOpenChange={setDetailsOpen} />
            <UserDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDelete}
                isLoading={busyId === selectedUser?.id}
                userLabel={selectedUser?.name || selectedUser?.email || selectedUser?.username || "user"}
            />
        </div>
    );
};

export default UsersPage;
