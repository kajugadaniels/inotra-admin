import { requestJson } from "../../http";
import type { BasicMessageResponse } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    categoryId: string;
};

export function deletePlaceCategory({ apiBaseUrl, accessToken, categoryId }: Args) {
    return requestJson<BasicMessageResponse>({
        apiBaseUrl,
        path: `/place/category/${categoryId}/delete/`,
        method: "DELETE",
        accessToken,
    });
}
