import { requestJson } from "../http";
import type { PaginatedResponse } from "../types";
import type { ChatParticipant } from "./listChatThreads";

export type ChatShareTarget =
    | {
          type: "EVENT" | "PACKAGE" | "LISTING";
          id: string;
          title?: string | null;
      }
    | null;

export type ChatMessage = {
    id: string;
    thread?: string | null;
    sender?: ChatParticipant | null;
    sender_type?: string | null;
    source_language?: string | null;
    source_text?: string | null;
    shared?: ChatShareTarget;
    created_at?: string | null;
};

export type ListChatMessagesArgs = {
    apiBaseUrl: string;
    accessToken: string;
    threadId: string;
    page?: number;
    pageSize?: number;
};

export function listChatMessages({ apiBaseUrl, accessToken, threadId, page, pageSize }: ListChatMessagesArgs) {
    const params = new URLSearchParams();
    if (typeof page === "number") params.set("page", String(page));
    if (typeof pageSize === "number") params.set("page_size", String(pageSize));

    const path = `/chats/threads/${threadId}/messages/${params.toString() ? `?${params.toString()}` : ""}`;

    return requestJson<PaginatedResponse<ChatMessage>>({
        apiBaseUrl,
        path,
        method: "GET",
        accessToken,
    });
}

