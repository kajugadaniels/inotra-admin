import { requestJson } from "../http";
import type { BasicMessageResponse } from "../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    highlightId: string;
};

export function deleteHighlight({ apiBaseUrl, accessToken, highlightId }: Args) {
    const path = `/highlight/${highlightId}/delete/`;
    return requestJson<BasicMessageResponse>({
        apiBaseUrl,
        path,
        method: "DELETE",
        accessToken,
    });
}
