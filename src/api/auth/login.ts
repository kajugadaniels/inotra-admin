import { requestJson } from "../http";
import type { LoginResponse } from "../types";

type Args = {
    apiBaseUrl: string;
    identifier: string;
    password: string;
};

export function loginAdminWithPassword({ apiBaseUrl, identifier, password }: Args) {
    return requestJson<LoginResponse>({
        apiBaseUrl,
        path: "/auth/login/",
        method: "POST",
        body: { identifier, password },
    });
}
