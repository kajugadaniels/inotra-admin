"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { listUsers } from "@/api/users";
import type { AdminUser } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import {
    UsersFilters,
    type UsersFiltersState,
    UsersHeader,
    UsersPagination,
    UsersTable,
} from "@/components/shared/users";

const DEFAULT_FILTERS: UsersFiltersState = {
    search: "",
    ordering: "date_joined",
    sort: "desc",
    isActive: "all",
};

const UsersPage = () => {
    const [filters, setFilters] = useState<UsersFiltersState>(DEFAULT_FILTERS);
    const [page, setPage] = useState(1);
    const [results, setResults] = useState<AdminUser[]>([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput }));
            setPage(1);
        }, 350);

        return () => clearTimeout(timer);
    }, [searchInput]);

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
            search: filters.search || undefined,
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
    }, [apiBaseUrl, filters, page]);

    const totalPages = Math.max(Math.ceil(count / 10), 1);

    return (
        <div className="space-y-6">
            <UsersHeader />

            <UsersFilters
                filters={{ ...filters, search: searchInput }}
                isLoading={isLoading}
                onFiltersChange={(next) => {
                    setFilters(next);
                    setSearchInput(next.search);
                    setPage(1);
                }}
                onReset={() => {
                    setFilters(DEFAULT_FILTERS);
                    setSearchInput("");
                    setPage(1);
                }}
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
