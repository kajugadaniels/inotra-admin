import { requestJson } from "../http";
import type { PaginatedResponse } from "../types";

export type ChatParticipant = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    image?: string | null;
};

export type ChatThreadListItem = {
    id: string;
    topic?: string | null;
    is_open?: boolean | null;
    user?: ChatParticipant | null;
    representative?: ChatParticipant | null;
    last_message_at?: string | null;
    last_message_preview?: string | null;
    messages_count?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export type ListChatThreadsArgs = {
    apiBaseUrl: string;
    accessToken: string;
    search?: string;
    ordering?: "last_message_at" | "created_at";
    sort?: "asc" | "desc";
    page?: number;
    pageSize?: number;
};

export function listChatThreads({
    apiBaseUrl,
    accessToken,
    search,
    ordering,
    sort,
    page,
    pageSize,
}: ListChatThreadsArgs) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (ordering) params.set("ordering", ordering);
    if (sort) params.set("sort", sort);
    if (typeof page === "number") params.set("page", String(page));
    if (typeof pageSize === "number") params.set("page_size", String(pageSize));

    const path = `/chats/threads/${params.toString() ? `?${params.toString()}` : ""}`;

    return requestJson<PaginatedResponse<ChatThreadListItem>>({
        apiBaseUrl,
        path,
        method: "GET",
        accessToken,
    });
}

