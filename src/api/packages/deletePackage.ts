import { requestJson } from "../http";
import type { BasicMessageResponse } from "../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    packageId: string;
};

export function deletePackage({ apiBaseUrl, accessToken, packageId }: Args) {
    const path = `/package/${packageId}/delete/`;
    return requestJson<BasicMessageResponse>({
        apiBaseUrl,
        path,
        method: "DELETE",
        accessToken,
    });
}

