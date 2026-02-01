import { requestJson } from "../http";
import type { PlaceDetail } from "../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    placeId: string;
    data: {
        name?: string;
        category?: string | null;
        description?: string;
        address?: string;
        city?: string;
        country?: string;
        latitude?: string | number | null;
        longitude?: string | number | null;
        phone?: string;
        whatsapp?: string;
        email?: string;
        website?: string;
        opening_hours?: unknown;
        is_verified?: boolean;
        is_active?: boolean;
        remove_image_ids?: string[];
        images?: File[];
        logo?: File | null;
        remove_logo?: boolean;
        services?: { name: string; is_available?: boolean }[];
    };
};

function buildFormData(data: Args["data"]) {
    const payload = new FormData();

    if (data.name !== undefined) payload.append("name", data.name);
    if (data.category !== undefined && data.category !== null) {
        payload.append("category", data.category);
    }
    if (data.description !== undefined) payload.append("description", data.description);
    if (data.address !== undefined) payload.append("address", data.address);
    if (data.city !== undefined) payload.append("city", data.city);
    if (data.country !== undefined) payload.append("country", data.country);
    if (data.latitude !== undefined) payload.append("latitude", String(data.latitude ?? ""));
    if (data.longitude !== undefined) payload.append("longitude", String(data.longitude ?? ""));
    if (data.phone !== undefined) payload.append("phone", data.phone);
    if (data.whatsapp !== undefined) payload.append("whatsapp", data.whatsapp);
    if (data.email !== undefined) payload.append("email", data.email);
    if (data.website !== undefined) payload.append("website", data.website);
    if (data.opening_hours !== undefined) {
        payload.append("opening_hours", JSON.stringify(data.opening_hours));
    }
    if (typeof data.is_verified === "boolean") {
        payload.append("is_verified", data.is_verified ? "true" : "false");
    }
    if (typeof data.is_active === "boolean") {
        payload.append("is_active", data.is_active ? "true" : "false");
    }
    if (data.logo) {
        payload.append("logo", data.logo);
    }
    if (data.remove_logo) {
        payload.append("remove_logo", "true");
    }
    if (data.services?.length) {
        payload.append("services", JSON.stringify(data.services));
    }
    if (data.remove_image_ids?.length) {
        data.remove_image_ids.forEach((id) => payload.append("remove_image_ids", id));
    }
    if (data.images?.length) {
        data.images.forEach((image) => payload.append("images", image));
    }

    return payload;
}

export function updatePlace({ apiBaseUrl, accessToken, placeId, data }: Args) {
    const useFormData = Boolean(
        data.images?.length ||
            data.remove_image_ids?.length ||
            data.logo ||
            data.remove_logo
    );

    return requestJson<{ message: string; place: PlaceDetail }>({
        apiBaseUrl,
        path: `/place/${placeId}/update/`,
        method: "PATCH",
        accessToken,
        body: useFormData ? buildFormData(data) : data,
    });
}
