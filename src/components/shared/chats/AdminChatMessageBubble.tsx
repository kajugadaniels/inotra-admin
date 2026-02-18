"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/api/chats";

type Props = {
    message: ChatMessage;
};

function formatTime(value?: string | null): string {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

const AdminChatMessageBubble = ({ message }: Props) => {
    const senderRole = (message.sender?.role ?? "").toUpperCase();
    const isUser = senderRole === "USER";
    const isRep = senderRole === "CUSTOMER_REPRESENTATIVE";

    const alignRight = isRep && !isUser;
    const senderLabel = (message.sender?.name || message.sender?.email || "Unknown").trim();
    const text = (message.source_text ?? "").trim();
    const createdAt = formatTime(message.created_at ?? null);

    const shared = message.shared ?? null;
    const sharedHref =
        shared?.type === "EVENT"
            ? `/events/${shared.id}`
            : shared?.type === "LISTING"
                ? `/listings/${shared.id}`
                : shared?.type === "PACKAGE"
                    ? `/trip-packages/${shared.id}`
                    : null;

    return (
        <div className={cn("flex w-full", alignRight ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[78%] sm:max-w-[70%]", alignRight ? "text-right" : "text-left")}>
                <p className="mb-1 text-[11px] font-semibold text-muted-foreground">{senderLabel}</p>

                <div
                    className={cn(
                        "rounded-3xl border px-4 py-3 text-sm leading-relaxed shadow-sm",
                        alignRight
                            ? "border-primary/20 bg-primary text-primary-foreground shadow-primary/10"
                            : "border-border/60 bg-background/70 text-foreground"
                    )}
                >
                    {text ? <p className="whitespace-pre-wrap break-words">{text}</p> : null}

                    {shared ? (
                        sharedHref ? (
                            <Link
                                href={sharedHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "mt-3 block rounded-2xl border px-3 py-2 text-xs transition",
                                    alignRight
                                        ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/15"
                                        : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/40"
                                )}
                                aria-label={`Open shared ${shared.type.toLowerCase()} in a new tab`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className={cn("font-semibold", alignRight ? "text-primary-foreground" : "text-foreground")}>
                                        Shared {shared.type.toLowerCase()}
                                    </p>
                                    <ArrowUpRight
                                        className={cn(
                                            "h-4 w-4",
                                            alignRight ? "text-primary-foreground" : "text-muted-foreground"
                                        )}
                                    />
                                </div>
                                <p className="mt-1 truncate">{shared.title ?? shared.id}</p>
                            </Link>
                        ) : (
                            <div
                                className={cn(
                                    "mt-3 rounded-2xl border px-3 py-2 text-xs",
                                    alignRight
                                        ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
                                        : "border-border/60 bg-muted/30 text-muted-foreground"
                                )}
                            >
                                <p className={cn("font-semibold", alignRight ? "text-primary-foreground" : "text-foreground")}>
                                    Shared {shared.type.toLowerCase()}
                                </p>
                                <p className="mt-1 truncate">{shared.title ?? shared.id}</p>
                            </div>
                        )
                    ) : null}
                </div>

                {createdAt ? (
                    <p className={cn("mt-1 text-[11px] font-semibold text-muted-foreground", alignRight ? "text-right" : "text-left")}>
                        {createdAt}
                    </p>
                ) : null}
            </div>
        </div>
    );
};

export default AdminChatMessageBubble;

