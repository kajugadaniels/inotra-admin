"use client";

import { useEffect, useMemo, useRef } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChatMessage, ChatThreadListItem } from "@/api/chats";
import AdminChatMessageBubble from "./AdminChatMessageBubble";

type Props = {
    thread: ChatThreadListItem;
    messages: ChatMessage[];
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    onClose: () => void;
};

const AdminChatConversation = ({ thread, messages, isLoading, hasMore, onLoadMore, onClose }: Props) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const topSentinelRef = useRef<HTMLDivElement | null>(null);

    const ordered = useMemo(() => {
        const copy = [...messages];
        copy.sort((a, b) => {
            const av = a.created_at ? new Date(a.created_at).getTime() : 0;
            const bv = b.created_at ? new Date(b.created_at).getTime() : 0;
            return av - bv;
        });
        return copy;
    }, [messages]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [thread.id]);

    useEffect(() => {
        const sentinel = topSentinelRef.current;
        const root = scrollRef.current;
        if (!sentinel || !root) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (!first?.isIntersecting) return;
                if (isLoading) return;
                if (!hasMore) return;
                onLoadMore();
            },
            { root, threshold: 0.1 }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, isLoading, onLoadMore]);

    const userLabel = (thread.user?.name || thread.user?.email || "User").trim();
    const repLabel = (thread.representative?.name || thread.representative?.email || "Representative").trim();

    return (
        <section className="flex h-[calc(70vh-2rem)] flex-col gap-4">
            <div className="flex items-center justify-between rounded-3xl border border-border/60 bg-card/60 px-5 py-4 shadow-lg shadow-black/5 backdrop-blur-xl">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                        {userLabel} <span className="mx-2 text-muted-foreground">↔</span> {repLabel}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                        Read-only view (admins cannot send or join conversations)
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-full border-border/60 bg-background/60"
                    onClick={onClose}
                    aria-label="Close conversation"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="min-h-0 flex-1">
                <div
                    ref={scrollRef}
                    className={cn(
                        "h-full overflow-y-auto rounded-3xl border border-border/60 bg-background/50 px-4 py-5 shadow-inner shadow-black/5",
                        "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
                    )}
                >
                    <div ref={topSentinelRef} />

                    <div className="space-y-4">
                        {isLoading && ordered.length === 0 ? (
                            <div className="rounded-2xl border border-border/60 bg-card/60 p-4 text-xs text-muted-foreground">
                                Loading messages…
                            </div>
                        ) : null}

                        {!isLoading && ordered.length === 0 ? (
                            <div className="rounded-2xl border border-border/60 bg-card/60 p-4 text-xs text-muted-foreground">
                                No messages yet.
                            </div>
                        ) : null}

                        {ordered.map((message) => (
                            <AdminChatMessageBubble key={message.id} message={message} />
                        ))}

                        {isLoading && ordered.length > 0 ? (
                            <div className="pt-2 text-center text-[11px] text-muted-foreground">Loading more…</div>
                        ) : null}

                        {!hasMore && ordered.length > 0 ? (
                            <div className="pt-2 text-center text-[11px] text-muted-foreground">You’re all caught up.</div>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminChatConversation;

