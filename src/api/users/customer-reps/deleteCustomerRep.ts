import { requestJson } from "../../http";
import type { BasicMessageResponse } from "../../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    userId: string;
};

export function deleteCustomerRep({ apiBaseUrl, accessToken, userId }: Args) {
    const path = `/customer-rep/${userId}/delete/`;

    return requestJson<BasicMessageResponse>({
        apiBaseUrl,
        path,
        method: "DELETE",
        accessToken,
    });
}
