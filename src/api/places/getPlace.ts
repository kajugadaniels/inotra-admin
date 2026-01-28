import { requestJson } from "../http";
import type { PlaceDetail } from "../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    placeId: string;
};

export function getPlace({ apiBaseUrl, accessToken, placeId }: Args) {
    return requestJson<PlaceDetail>({
        apiBaseUrl,
        path: `/place/${placeId}/`,
        method: "GET",
        accessToken,
    });
}
