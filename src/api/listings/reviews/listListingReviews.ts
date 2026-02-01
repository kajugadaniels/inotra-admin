import { requestJson } from "@/api/http";
import type { PaginatedResponse, Review } from "@/api/types";

type ListListingReviewsArgs = {
    apiBaseUrl: string;
    accessToken: string;
    listingId: string;
    search?: string;
    is_reported?: boolean;
    published?: boolean;
    rating?: number;
    ordering?: "created_at" | "rating";
    sort?: "asc" | "desc";
    page?: number;
    page_size?: number;
};

export function listListingReviews({
    apiBaseUrl,
    accessToken,
    listingId,
    search,
    is_reported,
    published,
    rating,
    ordering,
    sort,
    page,
    page_size,
}: ListListingReviewsArgs) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (typeof is_reported === "boolean") params.set("is_reported", String(is_reported));
    if (typeof published === "boolean") params.set("published", String(published));
    if (typeof rating === "number") params.set("rating", String(rating));
    if (ordering) params.set("ordering", ordering);
    if (sort) params.set("sort", sort);
    if (page) params.set("page", String(page));
    if (page_size) params.set("page_size", String(page_size));

    const query = params.toString();
    const path = query
        ? `/place/${listingId}/reviews/?${query}`
        : `/place/${listingId}/reviews/`;

    return requestJson<PaginatedResponse<Review>>({
        apiBaseUrl,
        path,
        method: "GET",
        accessToken,
    });
}
