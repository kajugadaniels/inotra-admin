import { requestJson } from "../../http";
import type { AdPlacement } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    placementId: string;
    data: {
        key?: string;
        title?: string;
        is_active?: boolean;
    };
};

export function updateAdPlacement({ apiBaseUrl, accessToken, placementId, data }: Args) {
    return requestJson<{ message: string; placement: AdPlacement }>({
        apiBaseUrl,
        path: `/ads/placement/${placementId}/update/`,
        method: "PATCH",
        accessToken,
        body: data,
    });
}
