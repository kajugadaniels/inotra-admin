import { requestJson } from "../../http";
import type { AdPlacement } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    data: {
        key: string;
        title?: string;
        is_active?: boolean;
    };
};

export function createAdPlacement({ apiBaseUrl, accessToken, data }: Args) {
    return requestJson<{ message: string; placement: AdPlacement }>({
        apiBaseUrl,
        path: "/ads/placement/add/",
        method: "POST",
        accessToken,
        body: data,
    });
}
