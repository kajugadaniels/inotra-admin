import { requestJson } from "../http";
import type { PaginatedResponse } from "../types";

export type PackageListItem = {
    id?: string;
    title?: string | null;
    duration_days?: number | null;
    cover_url?: string | null;
    activities_count?: number | null;
    is_active?: boolean | null;
};

export type ListPackagesArgs = {
    apiBaseUrl: string;
    accessToken: string;
    search?: string;
    is_active?: boolean;
    ordering?: "created_at" | "-created_at" | "title" | "-title" | "duration_days" | "-duration_days";
    page?: number;
};

export function listPackages({
    apiBaseUrl,
    accessToken,
    search,
    is_active,
    ordering,
    page,
}: ListPackagesArgs) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (typeof is_active === "boolean") params.set("is_active", String(is_active));
    if (ordering) params.set("ordering", ordering);
    if (typeof page === "number") params.set("page", String(page));

    const path = `/packages/${params.toString() ? `?${params.toString()}` : ""}`;

    return requestJson<PaginatedResponse<PackageListItem>>({
        apiBaseUrl,
        path,
        method: "GET",
        accessToken,
    });
}

