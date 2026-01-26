import { requestJson } from "../../http";
import type { AdPlacement } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
};

export function listAdPlacements({ apiBaseUrl, accessToken }: Args) {
    return requestJson<AdPlacement[]>({
        apiBaseUrl,
        path: "/ads/placements/",
        method: "GET",
        accessToken,
    });
}
