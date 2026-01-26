import { requestJson } from "../../http";
import type { BasicMessageResponse } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    creativeId: string;
};

export function deleteAdCreative({ apiBaseUrl, accessToken, creativeId }: Args) {
    return requestJson<BasicMessageResponse>({
        apiBaseUrl,
        path: `/ads/creatives/${creativeId}/delete/`,
        method: "DELETE",
        accessToken,
    });
}
