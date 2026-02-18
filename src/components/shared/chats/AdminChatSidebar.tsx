"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import type { ChatThreadListItem } from "@/api/chats";
import AdminChatThreadRow from "./AdminChatThreadRow";

type Props = {
    threads: ChatThreadListItem[];
    activeThreadId?: string | null;
    searchValue: string;
    onSearchChange: (value: string) => void;
    onSelectThread: (thread: ChatThreadListItem) => void;
    isLoading: boolean;
};

const AdminChatSidebar = ({
    threads,
    activeThreadId,
    searchValue,
    onSearchChange,
    onSelectThread,
    isLoading,
}: Props) => {
    return (
        <aside className="flex h-[calc(70vh-2rem)] flex-col gap-4 rounded-3xl border border-border/60 bg-card/60 p-4 shadow-lg shadow-black/5 backdrop-blur-xl">
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">All chats</p>
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={searchValue}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Search user or representative…"
                        className="h-11 rounded-2xl border-border/60 bg-background/60 pl-10 shadow-sm"
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                {isLoading ? (
                    <div className="rounded-2xl border border-border/60 bg-background/60 p-4 text-xs text-muted-foreground">
                        Loading conversations…
                    </div>
                ) : threads.length === 0 ? (
                    <div className="rounded-2xl border border-border/60 bg-background/60 p-4 text-xs text-muted-foreground">
                        No conversations found.
                    </div>
                ) : (
                    threads.map((thread) => (
                        <AdminChatThreadRow
                            key={thread.id}
                            thread={thread}
                            active={thread.id === activeThreadId}
                            onClick={() => onSelectThread(thread)}
                        />
                    ))
                )}
            </div>
        </aside>
    );
};

export default AdminChatSidebar;

