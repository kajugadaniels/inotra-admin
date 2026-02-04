import { requestJson } from "../http";
import type { BasicMessageResponse } from "../types";
import type { PackageDetail } from "./getPackage";
import type { PackageActivityInput } from "./createPackage";

export type UpdatePackageInput = {
    title?: string;
    description?: string;
    duration_days?: number | null;
    price_amount?: string | number | null;
    price_currency?: string | null;
    is_active?: boolean;
    cover_url?: File | null;
    remove_cover_url?: boolean;
    images?: File[];
    remove_image_ids?: string[];
    activities?: PackageActivityInput[]; // full replacement list
};

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    packageId: string;
    data: UpdatePackageInput;
};

export function updatePackage({ apiBaseUrl, accessToken, packageId, data }: Args) {
    const payload = new FormData();

    if (data.title !== undefined) payload.append("title", data.title);
    if (data.description !== undefined) payload.append("description", data.description);
    if (data.duration_days !== undefined) {
        if (data.duration_days === null) payload.append("duration_days", "");
        else payload.append("duration_days", String(data.duration_days));
    }
    if (data.price_amount !== undefined) {
        if (data.price_amount === null) payload.append("price_amount", "");
        else payload.append("price_amount", String(data.price_amount));
    }
    if (data.price_currency !== undefined) payload.append("price_currency", data.price_currency ?? "");
    if (typeof data.is_active === "boolean") payload.append("is_active", data.is_active ? "true" : "false");

    if (data.cover_url) payload.append("cover_url", data.cover_url);
    if (data.remove_cover_url) payload.append("remove_cover_url", "true");

    if (data.images?.length) data.images.forEach((img) => payload.append("images", img));
    if (data.remove_image_ids?.length) data.remove_image_ids.forEach((id) => payload.append("remove_image_ids", id));

    if (data.activities !== undefined) payload.append("activities", JSON.stringify(data.activities));

    return requestJson<{ message?: string; package?: PackageDetail } | BasicMessageResponse>({
        apiBaseUrl,
        path: `/package/${packageId}/update/`,
        method: "PATCH",
        body: payload,
        accessToken,
    });
}

