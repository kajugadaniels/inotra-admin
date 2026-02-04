import { requestJson } from "../http";
import type { PackageListItem } from "./listPackages";

export type PackageImage = {
    id?: string;
    image_url?: string | null;
    caption?: string | null;
    is_featured?: boolean | null;
    created_at?: string | null;
};

export type PackageActivity = {
    id?: string;
    activity_name?: string | null;
    time?: number | null;
    created_at?: string | null;
};

export type PackageDetail = PackageListItem & {
    description?: string | null;
    price_amount?: string | number | null;
    price_currency?: string | null;
    images?: PackageImage[];
    activities?: PackageActivity[];
    created_at?: string | null;
    updated_at?: string | null;
};

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    packageId: string;
};

export function getPackage({ apiBaseUrl, accessToken, packageId }: Args) {
    const path = `/package/${packageId}/`;
    return requestJson<PackageDetail>({
        apiBaseUrl,
        path,
        method: "GET",
        accessToken,
    });
}

