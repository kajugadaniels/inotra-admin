import { requestJson } from "../http";
import type { PaginatedResponse, PlaceListItem } from "../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    search?: string;
    category?: string;
    is_active?: boolean;
    is_verified?: boolean;
    ordering?: "created_at" | "name" | "city" | "country" | "avg_rating" | "reviews_count";
    sort?: "asc" | "desc";
    page?: number;
};

export function listPlaces({
    apiBaseUrl,
    accessToken,
    search,
    category,
    is_active,
    is_verified,
    ordering,
    sort,
    page,
}: Args) {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (typeof is_active === "boolean") params.set("is_active", String(is_active));
    if (typeof is_verified === "boolean") params.set("is_verified", String(is_verified));
    if (ordering) params.set("ordering", ordering);
    if (sort) params.set("sort", sort);
    if (typeof page === "number") params.set("page", String(page));

    const path = `/places/${params.toString() ? `?${params.toString()}` : ""}`;

    return requestJson<PaginatedResponse<PlaceListItem>>({
        apiBaseUrl,
        path,
        method: "GET",
        accessToken,
    });
}
