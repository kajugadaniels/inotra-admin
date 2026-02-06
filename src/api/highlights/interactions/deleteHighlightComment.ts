import { requestJson } from "@/api/http";
import type { BasicMessageResponse } from "@/api/types";

export type DeleteHighlightCommentResponse = BasicMessageResponse & {
    comments_count?: number | null;
};

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    commentId: string;
};

export function deleteHighlightComment({ apiBaseUrl, accessToken, commentId }: Args) {
    return requestJson<DeleteHighlightCommentResponse>({
        apiBaseUrl,
        path: `/highlight/comment/${commentId}/delete/`,
        method: "DELETE",
        accessToken,
    });
}

