import { requestJson } from "../http";
import type { Highlight } from "./listHighlights";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    highlightId: string;
};

export function getHighlight({ apiBaseUrl, accessToken, highlightId }: Args) {
    const path = `/highlight/${highlightId}/`;
    return requestJson<Highlight>({
        apiBaseUrl,
        path,
        method: "GET",
        accessToken,
    });
}
