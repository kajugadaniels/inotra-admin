"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { listChatMessages, listChatThreads } from "@/api/chats";
import type { ChatMessage, ChatThreadListItem } from "@/api/chats";

import AdminChatSidebar from "./AdminChatSidebar";
import AdminChatConversation from "./AdminChatConversation";

type Props = {
    apiBaseUrl: string;
};

type MessagesState = {
    items: ChatMessage[];
    page: number;
    hasMore: boolean;
    isLoading: boolean;
};

const AdminChatsPageClient = ({ apiBaseUrl }: Props) => {
    const [threads, setThreads] = useState<ChatThreadListItem[]>([]);
    const [threadsLoading, setThreadsLoading] = useState(false);
    const [threadsSearch, setThreadsSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [selectedThread, setSelectedThread] = useState<ChatThreadListItem | null>(null);

    const [messages, setMessages] = useState<MessagesState>({
        items: [],
        page: 1,
        hasMore: true,
        isLoading: false,
    });

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(threadsSearch), 350);
        return () => clearTimeout(timer);
    }, [threadsSearch]);

    useEffect(() => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", { description: "Sign in again to access chats." });
            return;
        }

        setThreadsLoading(true);
        listChatThreads({
            apiBaseUrl,
            accessToken: tokens.access,
            search: debouncedSearch || undefined,
            ordering: "last_message_at",
            sort: "desc",
            page: 1,
            pageSize: 50,
        })
            .then((res) => {
                if (!res.ok || !res.body) {
                    toast.error("Unable to load chats", { description: extractErrorDetail(res.body) });
                    return;
                }
                setThreads(res.body.results ?? []);
            })
            .catch((error: Error) => {
                toast.error("Unable to load chats", { description: error.message ?? "Check API connectivity." });
            })
            .finally(() => setThreadsLoading(false));
    }, [apiBaseUrl, debouncedSearch]);

    const loadMessagesPage = useCallback(
        async (threadId: string, page: number, replace?: boolean) => {
            const tokens = authStorage.getTokens();
            if (!tokens?.access) return;

            setMessages((prev) => ({ ...prev, isLoading: true }));
            try {
                const res = await listChatMessages({
                    apiBaseUrl,
                    accessToken: tokens.access,
                    threadId,
                    page,
                    pageSize: 50,
                });
                if (!res.ok || !res.body) {
                    toast.error("Unable to load messages", { description: extractErrorDetail(res.body) });
                    setMessages((prev) => ({ ...prev, isLoading: false }));
                    return;
                }

                const next = res.body.results ?? [];
                const hasMore = Boolean(res.body.next);

                setMessages((prev) => ({
                    items: replace ? next : [...next, ...prev.items],
                    page,
                    hasMore,
                    isLoading: false,
                }));
            } catch (error) {
                toast.error("Unable to load messages", {
                    description: error instanceof Error ? error.message : "Check API connectivity.",
                });
                setMessages((prev) => ({ ...prev, isLoading: false }));
            }
        },
        [apiBaseUrl]
    );

    const handleSelectThread = useCallback(
        async (thread: ChatThreadListItem) => {
            setSelectedThread(thread);
            setMessages({ items: [], page: 1, hasMore: true, isLoading: false });
            await loadMessagesPage(thread.id, 1, true);
        },
        [loadMessagesPage]
    );

    const handleLoadMore = useCallback(() => {
        if (!selectedThread?.id) return;
        if (messages.isLoading) return;
        if (!messages.hasMore) return;
        loadMessagesPage(selectedThread.id, messages.page + 1);
    }, [loadMessagesPage, messages.hasMore, messages.isLoading, messages.page, selectedThread?.id]);

    const filteredThreads = useMemo(() => threads, [threads]);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Chats</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Review conversations between users and customer representatives. This view is read-only.
                </p>
            </div>

            <div className="grid min-h-[300px] gap-6 lg:grid-cols-[360px_1fr]">
                <AdminChatSidebar
                    threads={filteredThreads}
                    activeThreadId={selectedThread?.id ?? null}
                    searchValue={threadsSearch}
                    onSearchChange={setThreadsSearch}
                    onSelectThread={handleSelectThread}
                    isLoading={threadsLoading}
                />

                {selectedThread ? (
                    <AdminChatConversation
                        thread={selectedThread}
                        messages={messages.items}
                        isLoading={messages.isLoading}
                        hasMore={messages.hasMore}
                        onLoadMore={handleLoadMore}
                        onClose={() => setSelectedThread(null)}
                    />
                ) : (
                    <div className="flex h-[calc(70vh-2rem)] items-center justify-center rounded-3xl border border-border/60 bg-card/60 p-10 text-center shadow-lg shadow-black/5 backdrop-blur-xl">
                        <div className="max-w-sm">
                            <p className="text-sm font-semibold text-foreground">Select a conversation</p>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Choose a thread from the left to review the conversation history.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChatsPageClient;

