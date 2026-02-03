import { requestJson } from "../http";
import type { Highlight } from "./listHighlights";
import type { BasicMessageResponse } from "../types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    data: FormData;
};

export function createHighlight({ apiBaseUrl, accessToken, data }: Args) {
    return requestJson<{ message?: string; highlight?: Highlight } | BasicMessageResponse>({
        apiBaseUrl,
        path: "/highlight/add/",
        method: "POST",
        body: data,
        accessToken,
    });
}
