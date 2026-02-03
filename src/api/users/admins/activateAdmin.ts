import { requestJson } from "../../http";
import type { BasicMessageResponse } from "../../types";

type Args = {
    apiBaseUrl: string;
    email: string;
    otp: string;
};

export function activateAdmin({ apiBaseUrl, email, otp }: Args) {
    const path = "/admin/activate/";
    const body = { email, otp };

    return requestJson<BasicMessageResponse>({
        apiBaseUrl,
        path,
        method: "POST",
        body,
    });
}
