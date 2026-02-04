import { requestJson } from "../http";
import type { BasicMessageResponse } from "../types";
import type { PackageDetail } from "./getPackage";

export type PackageActivityInput = {
    activity_name: string;
    time: number;
};

export type CreatePackageInput = {
    title: string;
    description?: string;
    duration_days?: number | null;
    price_amount?: string | number | null;
    price_currency?: string | null;
    is_active?: boolean;
    cover_url?: File | null;
    images?: File[];
    activities?: PackageActivityInput[];
};

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    data: CreatePackageInput;
};

export function createPackage({ apiBaseUrl, accessToken, data }: Args) {
    const payload = new FormData();
    payload.append("title", data.title);

    if (data.description) payload.append("description", data.description);
    if (typeof data.duration_days === "number") payload.append("duration_days", String(data.duration_days));
    if (data.price_amount !== undefined && data.price_amount !== null) {
        payload.append("price_amount", String(data.price_amount));
    }
    if (data.price_currency) payload.append("price_currency", data.price_currency);
    if (typeof data.is_active === "boolean") payload.append("is_active", data.is_active ? "true" : "false");

    if (data.cover_url) payload.append("cover_url", data.cover_url);
    if (data.images?.length) data.images.forEach((img) => payload.append("images", img));
    if (data.activities?.length) payload.append("activities", JSON.stringify(data.activities));

    return requestJson<{ message?: string; package?: PackageDetail } | BasicMessageResponse>({
        apiBaseUrl,
        path: "/package/add/",
        method: "POST",
        body: payload,
        accessToken,
    });
}

