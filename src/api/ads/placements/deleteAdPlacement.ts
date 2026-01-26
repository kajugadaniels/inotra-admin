import { requestJson } from "../../http";
import type { BasicMessageResponse } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    placementId: string;
};

export function deleteAdPlacement({ apiBaseUrl, accessToken, placementId }: Args) {
    return requestJson<BasicMessageResponse>({
        apiBaseUrl,
        path: `/ads/placement/${placementId}/delete/`,
        method: "DELETE",
        accessToken,
    });
}
