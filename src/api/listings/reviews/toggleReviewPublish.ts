import { requestJson } from "@/api/http";
import type { Review } from "@/api/types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    reviewId: string;
};

export function toggleReviewPublish({ apiBaseUrl, accessToken, reviewId }: Args) {
    return requestJson<{ message: string; review: Review }>({
        apiBaseUrl,
        path: `/review/${reviewId}/publish/`,
        method: "PATCH",
        accessToken,
    });
}
