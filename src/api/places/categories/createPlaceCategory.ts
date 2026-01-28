import { requestJson } from "../../http";
import type { PlaceCategory } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    data: {
        name: string;
        icon?: string;
        is_active?: boolean;
    };
};

export function createPlaceCategory({ apiBaseUrl, accessToken, data }: Args) {
    return requestJson<{ message: string; category: PlaceCategory }>({
        apiBaseUrl,
        path: "/place/category/add/",
        method: "POST",
        accessToken,
        body: data,
    });
}
