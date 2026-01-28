import { requestJson } from "../../http";
import type { PlaceCategory } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
};

export function listPlaceCategories({ apiBaseUrl, accessToken }: Args) {
    return requestJson<PlaceCategory[]>({
        apiBaseUrl,
        path: "/place/categories/",
        method: "GET",
        accessToken,
    });
}
