import { requestJson } from "../../http";
import type { AdminUser, BasicMessageResponse } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
};

export function createCustomerRep({ apiBaseUrl, accessToken, email, first_name, last_name, phone }: Args) {
    const path = "/customer-rep/add/";
    const body = { email, first_name, last_name, phone };

    return requestJson<{ message: string; user: AdminUser } | BasicMessageResponse>({
        apiBaseUrl,
        path,
        method: "POST",
        accessToken,
        body,
    });
}
