import { requestJson } from "../../http";
import type { AdCreative } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
};

export function listAdCreatives({ apiBaseUrl, accessToken }: Args) {
    return requestJson<AdCreative[]>({
        apiBaseUrl,
        path: "/ads/creatives/",
        method: "GET",
        accessToken,
    });
}
