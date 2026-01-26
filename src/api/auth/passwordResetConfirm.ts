import { requestJson } from "../http";
import type { BasicMessageResponse } from "../types";

type Args = {
    apiBaseUrl: string;
    email: string;
    otp: string;
    new_password: string;
    confirm_new_password: string;
};

export function confirmAdminPasswordReset(args: Args) {
    return requestJson<BasicMessageResponse>({
        apiBaseUrl: args.apiBaseUrl,
        path: "/auth/password/reset/confirm/",
        method: "POST",
        body: {
            email: args.email,
            otp: args.otp,
            new_password: args.new_password,
            confirm_new_password: args.confirm_new_password,
        },
    });
}
