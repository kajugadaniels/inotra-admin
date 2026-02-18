"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ChatThreadListItem } from "@/api/chats";

type Props = {
    thread: ChatThreadListItem;
    active?: boolean;
    onClick: () => void;
};

function formatRelative(value?: string | null): string {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

const AdminChatThreadRow = ({ thread, active, onClick }: Props) => {
    const user = thread.user;
    const rep = thread.representative;
    const userLabel = (user?.name || user?.email || "User").trim();
    const repLabel = (rep?.name || rep?.email || "Representative").trim();

    const avatarUrl = user?.image ?? null;
    const lastAt = formatRelative(thread.last_message_at ?? null);
    const preview = (thread.last_message_preview ?? "").trim() || "No messages yet";

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition",
                active
                    ? "border-primary/30 bg-primary/10"
                    : "border-border/60 bg-background/60 hover:bg-muted/40"
            )}
        >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/60 bg-muted/30">
                {avatarUrl ? (
                    <Image src={avatarUrl} alt={userLabel} fill className="object-cover" sizes="40px" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                        {userLabel.slice(0, 1).toUpperCase()}
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                        {userLabel}
                        <span className="mx-2 text-muted-foreground">↔</span>
                        {repLabel}
                    </p>
                    {lastAt ? (
                        <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">{lastAt}</span>
                    ) : null}
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{preview}</p>
            </div>
        </button>
    );
};

export default AdminChatThreadRow;

