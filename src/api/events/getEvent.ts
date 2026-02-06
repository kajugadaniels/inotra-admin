import { requestJson } from "../http";
import type { EventListItem } from "./listEvents";

export type EventTicket = {
    id: string;
    category: "FREE" | "REGULAR" | "VIP" | "VVIP" | "TABLE";
    price?: string | number | null;
    created_at?: string | null;
};

export type EventDetail = EventListItem & {
    description?: string | null;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    latitude?: string | number | null;
    longitude?: string | number | null;
    organizer_name?: string | null;
    organizer_contact?: string | null;
    tickets?: EventTicket[];
};

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    eventId: string;
};

export function getEvent({ apiBaseUrl, accessToken, eventId }: Args) {
    const path = `/event/${eventId}/`;
    return requestJson<EventDetail>({
        apiBaseUrl,
        path,
        method: "GET",
        accessToken,
    });
}
