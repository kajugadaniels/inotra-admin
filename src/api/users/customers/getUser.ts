import { requestJson } from "../../http";
import type { AdminUser, BasicMessageResponse } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    userId: string;
};

export function getUser({ apiBaseUrl, accessToken, userId }: Args) {
    const path = `/user/${userId}/`;
    return requestJson<AdminUser | BasicMessageResponse>({
        apiBaseUrl,
        path,
        method: "GET",
        accessToken,
    });
}
