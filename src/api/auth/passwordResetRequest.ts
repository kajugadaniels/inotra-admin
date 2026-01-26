import { requestJson } from "../http";
import type { PasswordResetResponse } from "../types";

export function requestAdminPasswordReset(apiBaseUrl: string, email: string) {
    return requestJson<PasswordResetResponse>({
        apiBaseUrl,
        path: "/auth/password/reset/request/",
        method: "POST",
        body: { email },
    });
}
