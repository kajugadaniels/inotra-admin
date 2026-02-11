import { requestJson } from "@/api/http";
import type { ListingSubmissionListItem, PaginatedResponse } from "@/api/types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    search?: string;
    status?: "PENDING" | "APPROVED" | "REJECTED";
    category?: string;
    city?: string;
    country?: string;
    ordering?: "created_at" | "updated_at" | "name" | "status" | "city" | "country";
    sort?: "asc" | "desc";
    page?: number;
    page_size?: number;
};

export function listListingSubmissions({
    apiBaseUrl,
    accessToken,
    search,
    status,
    category,
    city,
    country,
    ordering,
    sort,
    page,
    page_size,
}: Args) {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    if (country) params.set("country", country);
    if (ordering) params.set("ordering", ordering);
    if (sort) params.set("sort", sort);
    if (typeof page === "number") params.set("page", String(page));
    if (typeof page_size === "number") params.set("page_size", String(page_size));

    const path = `/listing-submissions/${params.toString() ? `?${params.toString()}` : ""}`;

    return requestJson<PaginatedResponse<ListingSubmissionListItem>>({
        apiBaseUrl,
        path,
        method: "GET",
        accessToken,
    });
}
