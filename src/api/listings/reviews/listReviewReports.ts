import { requestJson } from "@/api/http";
import type { PaginatedResponse, ReviewReport } from "@/api/types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    search?: string;
    status?: string;
    place_id?: string;
    ordering?: "created_at" | "status";
    sort?: "asc" | "desc";
    page?: number;
    page_size?: number;
};

export function listReviewReports({
    apiBaseUrl,
    accessToken,
    search,
    status,
    place_id,
    ordering,
    sort,
    page,
    page_size,
}: Args) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (place_id) params.set("place_id", place_id);
    if (ordering) params.set("ordering", ordering);
    if (sort) params.set("sort", sort);
    if (page) params.set("page", String(page));
    if (page_size) params.set("page_size", String(page_size));

    const query = params.toString();
    const path = query ? `/review-reports/?${query}` : "/review-reports/";

    return requestJson<PaginatedResponse<ReviewReport>>({
        apiBaseUrl,
        path,
        method: "GET",
        accessToken,
    });
}
