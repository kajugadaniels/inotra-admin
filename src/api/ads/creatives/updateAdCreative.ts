import { requestJson } from "../../http";
import type { AdCreative } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    creativeId: string;
    data: {
        placementId?: string;
        title?: string;
        target_url?: string;
        starts_at?: string;
        ends_at?: string;
        is_active?: boolean;
        image?: File | null;
        remove_image?: boolean;
    };
};

export function updateAdCreative({ apiBaseUrl, accessToken, creativeId, data }: Args) {
    const payload = new FormData();

    if (data.placementId) payload.append("placement", data.placementId);
    if (data.title !== undefined) payload.append("title", data.title ?? "");
    if (data.target_url !== undefined) payload.append("target_url", data.target_url ?? "");
    if (data.starts_at !== undefined) payload.append("starts_at", data.starts_at ?? "");
    if (data.ends_at !== undefined) payload.append("ends_at", data.ends_at ?? "");
    if (typeof data.is_active === "boolean") {
        payload.append("is_active", data.is_active ? "true" : "false");
    }
    if (typeof data.remove_image === "boolean") {
        payload.append("remove_image", data.remove_image ? "true" : "false");
    }
    if (data.image) payload.append("image", data.image);

    return requestJson<{ message: string; creative: AdCreative }>({
        apiBaseUrl,
        path: `/ads/creative/${creativeId}/update/`,
        method: "PATCH",
        accessToken,
        body: payload,
    });
}
