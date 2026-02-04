import { requestJson } from "../http";
import type { BasicMessageResponse } from "../types";
import type { PackageListItem } from "./listPackages";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    packageId: string;
};

export function togglePackageActive({ apiBaseUrl, accessToken, packageId }: Args) {
    const path = `/package/${packageId}/active/`;
    return requestJson<{ message?: string; package?: PackageListItem } | BasicMessageResponse>({
        apiBaseUrl,
        path,
        method: "POST",
        accessToken,
    });
}

