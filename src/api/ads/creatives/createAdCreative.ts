import { requestJson } from "../../http";
import type { AdCreative } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    data: {
        placementId: string;
        title?: string;
        target_url?: string;
        starts_at?: string;
        ends_at?: string;
        is_active?: boolean;
        image?: File | null;
    };
};

export function createAdCreative({ apiBaseUrl, accessToken, data }: Args) {
    const payload = new FormData();
    payload.append("placement", data.placementId);

    if (data.title) payload.append("title", data.title);
    if (data.target_url) payload.append("target_url", data.target_url);
    if (data.starts_at) payload.append("starts_at", data.starts_at);
    if (data.ends_at) payload.append("ends_at", data.ends_at);
    if (typeof data.is_active === "boolean") {
        payload.append("is_active", data.is_active ? "true" : "false");
    }
    if (data.image) payload.append("image", data.image);

    return requestJson<{ message: string; creative: AdCreative }>({
        apiBaseUrl,
        path: "/ads/creatives/add/",
        method: "POST",
        accessToken,
        body: payload,
    });
}
