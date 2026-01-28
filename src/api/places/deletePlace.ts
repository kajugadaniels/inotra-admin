import { requestJson } from "../http";
import type { BasicMessageResponse } from "../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    placeId: string;
};

export function deletePlace({ apiBaseUrl, accessToken, placeId }: Args) {
    return requestJson<BasicMessageResponse>({
        apiBaseUrl,
        path: `/place/${placeId}/delete/`,
        method: "DELETE",
        accessToken,
    });
}
