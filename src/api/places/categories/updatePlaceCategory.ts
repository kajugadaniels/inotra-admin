import { requestJson } from "../../http";
import type { PlaceCategory } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    categoryId: string;
    data: {
        name?: string;
        icon?: string;
        is_active?: boolean;
    };
};

export function updatePlaceCategory({ apiBaseUrl, accessToken, categoryId, data }: Args) {
    return requestJson<{ message: string; category: PlaceCategory }>({
        apiBaseUrl,
        path: `/place/category/${categoryId}/update/`,
        method: "PATCH",
        accessToken,
        body: data,
    });
}
