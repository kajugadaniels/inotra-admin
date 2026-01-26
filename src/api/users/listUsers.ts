import { requestJson } from "../http";
import type { AdminUser, PaginatedResponse } from "../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    search?: string;
    ordering?:
        | "date_joined"
        | "email"
        | "username"
        | "name"
        | "first_name"
        | "last_name"
        | "phone";
    sort?: "asc" | "desc";
    is_active?: boolean;
    page?: number;
};

export function listUsers({
    apiBaseUrl,
    accessToken,
    search,
    ordering,
    sort,
    is_active,
    page,
}: Args) {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (ordering) params.set("ordering", ordering);
    if (sort) params.set("sort", sort);
    if (typeof is_active === "boolean") params.set("is_active", String(is_active));
    if (typeof page === "number") params.set("page", String(page));

    const path = `/users/${params.toString() ? `?${params.toString()}` : ""}`;

    return requestJson<PaginatedResponse<AdminUser>>({
        apiBaseUrl,
        path,
        method: "GET",
        accessToken,
    });
}
