import { requestJson } from "../../http";
import type { AdminUser, BasicMessageResponse } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    userId: string;
    is_active?: boolean;
};

export function toggleAdminActive({ apiBaseUrl, accessToken, userId, is_active }: Args) {
    const path = `/admin/${userId}/active/`;
    const body = typeof is_active === "boolean" ? { is_active } : {};

    return requestJson<{ user: AdminUser; message?: string } | BasicMessageResponse>({
        apiBaseUrl,
        path,
        method: "PATCH",
        accessToken,
        body,
    });
}
