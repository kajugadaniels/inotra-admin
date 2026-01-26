import { requestJson } from "../http";
import type { AdminUser } from "../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    data: FormData | Record<string, unknown>;
};

export function updateAdminProfile({ apiBaseUrl, accessToken, data }: Args) {
    return requestJson<{ message: string; user: AdminUser }>({
        apiBaseUrl,
        path: "/me/update/",
        method: "PATCH",
        accessToken,
        body: data,
    });
}
