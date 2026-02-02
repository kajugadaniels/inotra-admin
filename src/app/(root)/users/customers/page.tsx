"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { listUsers } from "@/api/users";
import type { AdminUser } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import { UsersHeader, UsersPagination, UsersTable } from "@/components/shared/users";
import { defaultUsersFilters, type UsersFiltersState } from "@/components/shared/users/UsersFilters";

const UsersPage = () => {
    const [filters, setFilters] = useState<UsersFiltersState>(defaultUsersFilters);
    const [page, setPage] = useState(1);
    const [results, setResults] = useState<AdminUser[]>([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Debounce only the API search term (NOT the input)
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

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

    return (
        <div className="space-y-6">
            <UsersHeader
                filters={filters}
                isLoading={isLoading}
                onFiltersChange={handleFiltersChange}
                onReset={handleReset}
            />

            <UsersTable users={results} isLoading={isLoading} />

            <UsersPagination
                page={page}
                totalPages={totalPages}
                isLoading={isLoading}
                onPageChange={setPage}
            />
        </div>
    );
};

export default UsersPage;
