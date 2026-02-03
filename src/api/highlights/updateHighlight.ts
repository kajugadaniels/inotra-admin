import { requestJson } from "../http";
import type { Highlight } from "./listHighlights";
import type { BasicMessageResponse } from "../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    highlightId: string;
    data: FormData | Record<string, unknown>;
};

export function updateHighlight({ apiBaseUrl, accessToken, highlightId, data }: Args) {
    const path = `/highlight/${highlightId}/update/`;
    return requestJson<{ message?: string; highlight?: Highlight } | BasicMessageResponse>({
        apiBaseUrl,
        path,
        method: "PATCH",
        body: data,
        accessToken,
    });
}
