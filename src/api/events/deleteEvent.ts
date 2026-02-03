import { requestJson } from "../http";
import type { BasicMessageResponse } from "../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    eventId: string;
};

export function deleteEvent({ apiBaseUrl, accessToken, eventId }: Args) {
    const path = `/event/${eventId}/delete/`;
    return requestJson<BasicMessageResponse>({
        apiBaseUrl,
        path,
        method: "DELETE",
        accessToken,
    });
}
