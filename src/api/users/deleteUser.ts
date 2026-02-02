import { requestJson } from "../http";
import type { BasicMessageResponse } from "../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    userId: string;
};

export function deleteUser({ apiBaseUrl, accessToken, userId }: Args) {
    const path = `/users/${userId}/delete/`;
    return requestJson<BasicMessageResponse>({
        apiBaseUrl,
        path,
        method: "DELETE",
        accessToken,
    });
}
