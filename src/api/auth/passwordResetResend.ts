import { requestJson } from "../http";
import type { PasswordResetResponse } from "../types";

export function resendAdminPasswordResetOtp(apiBaseUrl: string, email: string) {
    return requestJson<PasswordResetResponse>({
        apiBaseUrl,
        path: "/auth/password/reset/resend/",
        method: "POST",
        body: { email },
    });
}
