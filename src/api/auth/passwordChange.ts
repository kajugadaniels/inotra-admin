import { requestJson } from "../http";
import type { BasicMessageResponse } from "../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    current_password: string;
    new_password: string;
    confirm_new_password: string;
};

export function changeAdminPassword(args: Args) {
    return requestJson<BasicMessageResponse>({
        apiBaseUrl: args.apiBaseUrl,
        path: "/me/password/change/",
        method: "POST",
        accessToken: args.accessToken,
        body: {
            current_password: args.current_password,
            new_password: args.new_password,
            confirm_new_password: args.confirm_new_password,
        },
    });
}
