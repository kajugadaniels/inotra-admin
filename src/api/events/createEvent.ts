import { requestJson } from "../http";
import type { BasicMessageResponse } from "../types";
import type { EventDetail } from "./getEvent";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    data: FormData | {
        title: string;
        description?: string;
        start_at?: string;
        end_at?: string;
        venue_name?: string;
        address?: string;
        city?: string;
        country?: string;
        latitude?: string | number;
        longitude?: string | number;
        organizer_name?: string;
        organizer_contact?: string;
        tickets?: { category: string; price?: string | number | null }[];
        is_active?: boolean;
        is_verified?: boolean;
    };
};

export function createEvent({ apiBaseUrl, accessToken, data }: Args) {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const body = isFormData ? data : data;

    return requestJson<{ message?: string; event?: EventDetail } | BasicMessageResponse>({
        apiBaseUrl,
        path: "/event/add/",
        method: "POST",
        body,
        accessToken,
    });
}
