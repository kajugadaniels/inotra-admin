import { requestJson } from "../http";
import type { GoogleLoginResponse } from "../types";

type Args = {
    apiBaseUrl: string;
    idToken: string;
};

export function exchangeAdminGoogleToken({ apiBaseUrl, idToken }: Args) {
    return requestJson<GoogleLoginResponse>({
        apiBaseUrl,
        path: "/auth/google/login/",
        method: "POST",
        body: { IdToken: idToken },
    });
}
