import { requestJson } from "../../http";
import type { AdPlacement } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    placementId: string;
};

export function getAdPlacement({ apiBaseUrl, accessToken, placementId }: Args) {
    return requestJson<AdPlacement>({
        apiBaseUrl,
        path: `/ads/placements/${placementId}/`,
        method: "GET",
        accessToken,
    });
}
