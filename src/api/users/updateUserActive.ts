import { requestJson } from "../http";
import type { AdminUser, BasicMessageResponse } from "../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    userId: string;
    is_active?: boolean; // optional for toggle; send when explicit
};

export function updateUserActive({ apiBaseUrl, accessToken, userId, is_active }: Args) {
    const path = `/users/${userId}/active/`;
    const body = typeof is_active === "boolean" ? { is_active } : {};

    return requestJson<{ user: AdminUser } | BasicMessageResponse>({
        apiBaseUrl,
        path,
        method: "PATCH",
        accessToken,
        body,
    });
}
