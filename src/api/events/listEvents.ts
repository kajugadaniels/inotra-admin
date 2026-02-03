import { requestJson } from "../http";
import type { PaginatedResponse } from "../types";

export type EventListItem = {
    id?: string;
    title?: string | null;
    banner_url?: string | null;
    start_at?: string | null;
    end_at?: string | null;
    venue_name?: string | null;
    price?: string | number | null;
    is_active?: boolean | null;
    is_verified?: boolean | null;
};

export type ListEventsArgs = {
    apiBaseUrl: string;
    accessToken: string;
    search?: string;
    city?: string;
    country?: string;
    is_active?: boolean;
    is_verified?: boolean;
    start_from?: string;
    start_to?: string;
    ordering?: "start_at" | "created_at" | "title" | "city" | "country";
    sort?: "asc" | "desc";
    page?: number;
};

export function listEvents({
    apiBaseUrl,
    accessToken,
    search,
    city,
    country,
    is_active,
    is_verified,
    start_from,
    start_to,
    ordering,
    sort,
    page,
}: ListEventsArgs) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    if (country) params.set("country", country);
    if (typeof is_active === "boolean") params.set("is_active", String(is_active));
    if (typeof is_verified === "boolean") params.set("is_verified", String(is_verified));
    if (start_from) params.set("start_from", start_from);
    if (start_to) params.set("start_to", start_to);
    if (ordering) params.set("ordering", ordering);
    if (sort) params.set("sort", sort);
    if (typeof page === "number") params.set("page", String(page));

    const path = `/events/${params.toString() ? `?${params.toString()}` : ""}`;

    return requestJson<PaginatedResponse<EventListItem>>({
        apiBaseUrl,
        path,
        method: "GET",
        accessToken,
    });
}
