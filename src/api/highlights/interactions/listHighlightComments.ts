import { requestJson } from "@/api/http";
import type { HighlightComment, PaginatedResponse } from "@/api/types";

export type ListHighlightCommentsArgs = {
    apiBaseUrl: string;
    accessToken: string;
    page?: number;
    page_size?: number;
    search?: string;
    highlight_id?: string;
    user_id?: string;
    place_id?: string;
    event_id?: string;
    ordering?: "created_at";
    sort?: "asc" | "desc";
};

export function listHighlightComments({
    apiBaseUrl,
    accessToken,
    page,
    page_size,
    search,
    highlight_id,
    user_id,
    place_id,
    event_id,
    ordering,
    sort,
}: ListHighlightCommentsArgs) {
    const params = new URLSearchParams();
    if (typeof page === "number") params.set("page", String(page));
    if (typeof page_size === "number") params.set("page_size", String(page_size));
    if (search) params.set("search", search);
    if (highlight_id) params.set("highlight_id", highlight_id);
    if (user_id) params.set("user_id", user_id);
    if (place_id) params.set("place_id", place_id);
    if (event_id) params.set("event_id", event_id);
    if (ordering) params.set("ordering", ordering);
    if (sort) params.set("sort", sort);

    const path = `/highlight/comments/${params.toString() ? `?${params.toString()}` : ""}`;

    return requestJson<
        PaginatedResponse<HighlightComment> & { filters?: Record<string, unknown> }
    >({
        apiBaseUrl,
        path,
        method: "GET",
        accessToken,
    });
}

