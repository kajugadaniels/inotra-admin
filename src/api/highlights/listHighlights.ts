import { requestJson } from "../http";
import type { PaginatedResponse } from "../types";

export type HighlightMedia = {
    id?: string;
    media_type?: "IMAGE" | "VIDEO";
    image_url?: string | null;
    video_url?: string | null;
    caption?: string | null;
    sort_order?: number | null;
};

export type Highlight = {
    id?: string;
    user_id?: string | null;
    place_id?: string | null;
    event_id?: string | null;
    caption?: string | null;
    likes_count?: number | null;
    comments_count?: number | null;
    shares_count?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
    media?: HighlightMedia[];
};

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    page?: number;
};

export function listHighlights({ apiBaseUrl, accessToken, page }: Args) {
    const params = new URLSearchParams();
    if (typeof page === "number") params.set("page", String(page));

    const path = `/highlights/${params.toString() ? `?${params.toString()}` : ""}`;

    return requestJson<PaginatedResponse<Highlight>>({
        apiBaseUrl,
        path,
        method: "GET",
        accessToken,
    });
}
