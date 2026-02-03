import { requestJson } from "../http";
import type { EventDetail } from "./getEvent";
import type { BasicMessageResponse } from "../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    eventId: string;
    data: FormData | {
        title?: string;
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
        price?: string | number;
        discount_price?: string | number;
        is_active?: boolean;
        is_verified?: boolean;
        remove_banner?: boolean;
    };
};

export function updateEvent({ apiBaseUrl, accessToken, eventId, data }: Args) {
    const path = `/event/${eventId}/update/`;
    return requestJson<{ message?: string; event?: EventDetail } | BasicMessageResponse>({
        apiBaseUrl,
        path,
        method: "PATCH",
        body: data,
        accessToken,
    });
}
