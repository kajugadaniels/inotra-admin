import { requestJson } from "../../http";
import type { AdCreative } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    creativeId: string;
};

export function getAdCreative({ apiBaseUrl, accessToken, creativeId }: Args) {
    return requestJson<AdCreative>({
        apiBaseUrl,
        path: `/ads/creative/${creativeId}/`,
        method: "GET",
        accessToken,
    });
}
