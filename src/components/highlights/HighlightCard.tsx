"use client";

import Image from "next/image";
import { Layers, Play, Heart, MessageCircle, Send } from "lucide-react";

import type { Highlight } from "@/api/highlights/listHighlights";
import { cn } from "@/lib/utils";
import HighlightActionsMenu from "./HighlightActionsMenu";
import { formatShortDate, pickCover, getMediaUrl } from "./highlight-utils";

type Props = {
    highlight: Highlight;
    onView?: (highlight: Highlight) => void;
    onDelete?: (highlight: Highlight) => void;
    onEdit?: (highlight: Highlight) => void;
};

const HighlightCard = ({ highlight, onView, onDelete, onEdit }: Props) => {
    const cover = pickCover(highlight.media);
    const coverUrl = getMediaUrl(cover);
    const isVideo = cover?.media_type === "VIDEO";
    const mediaCount = highlight.media?.length ?? 0;

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onView?.(highlight)}
            onKeyDown={(e) => {
                if (e.key === "Enter") onView?.(highlight);
            }}
            className={cn(
                "group relative aspect-square overflow-hidden rounded-2xl border border-border/50 bg-black shadow-sm",
                "transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
            )}
        >
            {coverUrl ? (
                <Image
                    src={coverUrl}
                    alt="Highlight cover"
                    fill
                    sizes="(max-width:768px) 33vw, 20vw"
                    className="object-cover"
                />
            ) : (
                <div className="flex h-full items-center justify-center text-xs text-white/70">
                    No media
                </div>
            )}

            {/* Top overlays */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-white">
                    {isVideo ? <Play className="h-3.5 w-3.5" /> : null}
                    {mediaCount > 1 ? (
                        <span className="inline-flex items-center gap-1">
                            <Layers className="h-3.5 w-3.5" />
                            {mediaCount}
                        </span>
                    ) : (
                        <span className="opacity-90">Highlight</span>
                    )}
                </div>

                <HighlightActionsMenu
                    onView={() => onView?.(highlight)}
                    onEdit={() => onEdit?.(highlight)}
                    onDelete={() => onDelete?.(highlight)}
                />
            </div>

            {/* Bottom gradient info */}
            <div className="absolute inset-x-0 bottom-0">
                <div className="h-20 bg-gradient-to-t from-black/75 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="line-clamp-2 text-xs font-semibold text-white">
                        {highlight.caption || "No caption"}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-white/80">
                        <div className="inline-flex items-center gap-3">
                            <span className="inline-flex items-center gap-1">
                                <Heart className="h-3.5 w-3.5" />
                                {highlight.likes_count ?? 0}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <MessageCircle className="h-3.5 w-3.5" />
                                {highlight.comments_count ?? 0}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Send className="h-3.5 w-3.5" />
                                {highlight.shares_count ?? 0}
                            </span>
                        </div>

                        <span className="opacity-80">{formatShortDate(highlight.created_at)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighlightCard;
