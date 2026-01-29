import { requestJson } from "../http";
import type { PlaceDetail } from "../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    data: {
        name: string;
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
        images?: File[];
        services?: { name: string; is_available?: boolean }[];
    };
};

export function createPlace({ apiBaseUrl, accessToken, data }: Args) {
    const payload = new FormData();
    payload.append("name", data.name);

    if (data.category) payload.append("category", data.category);
    if (data.description) payload.append("description", data.description);
    if (data.address) payload.append("address", data.address);
    if (data.city) payload.append("city", data.city);
    if (data.country) payload.append("country", data.country);
    if (data.latitude !== undefined && data.latitude !== null) {
        payload.append("latitude", String(data.latitude));
    }
    if (data.longitude !== undefined && data.longitude !== null) {
        payload.append("longitude", String(data.longitude));
    }
    if (data.phone) payload.append("phone", data.phone);
    if (data.whatsapp) payload.append("whatsapp", data.whatsapp);
    if (data.email) payload.append("email", data.email);
    if (data.website) payload.append("website", data.website);
    if (data.opening_hours !== undefined) {
        payload.append("opening_hours", JSON.stringify(data.opening_hours));
    }
    if (typeof data.is_verified === "boolean") {
        payload.append("is_verified", data.is_verified ? "true" : "false");
    }
    if (typeof data.is_active === "boolean") {
        payload.append("is_active", data.is_active ? "true" : "false");
    }
    if (data.services?.length) {
        payload.append("services", JSON.stringify(data.services));
    }
    if (data.images?.length) {
        data.images.forEach((image) => payload.append("images", image));
    }

    return requestJson<{ message: string; place: PlaceDetail }>({
        apiBaseUrl,
        path: "/place/add/",
        method: "POST",
        accessToken,
        body: payload,
    });
}
