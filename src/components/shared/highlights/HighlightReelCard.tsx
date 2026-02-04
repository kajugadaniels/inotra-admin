"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";

import type { Highlight } from "@/api/highlights/listHighlights";
import HighlightMediaCarousel from "./HighlightMediaCarousel";
import HighlightActionsMenu from "./HighlightActionsMenu";
import { formatShortDate } from "./highlight-utils";

type Props = {
    highlight: Highlight;
    onView?: (highlight: Highlight) => void;
    onEdit?: (highlight: Highlight) => void;
    onDelete?: (highlight: Highlight) => void;
};

const HighlightReelCard = ({ highlight, onView, onEdit, onDelete }: Props) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [active, setActive] = useState(false);

    // Detect "active" card for autoplay video behavior (IntersectionObserver)
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const obs = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                setActive(!!entry?.isIntersecting && (entry.intersectionRatio ?? 0) > 0.65);
            },
            { threshold: [0.25, 0.5, 0.65, 0.8] }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} className="snap-start py-4">
            <div className="relative mx-auto w-full max-w-[430px] overflow-hidden rounded-3xl border border-border/60 bg-black shadow-2xl shadow-black/10">
                <div className="aspect-[9/16] w-full">
                    <HighlightMediaCarousel media={highlight.media ?? []} mode="reel" active={active} />
                </div>

                {/* Actions */}
                <div className="absolute right-3 top-3">
                    <HighlightActionsMenu
                        onView={() => onView?.(highlight)}
                        onEdit={() => onEdit?.(highlight)}
                        onDelete={() => onDelete?.(highlight)}
                        align="end"
                    />
                </div>

                {/* Bottom info */}
                <div className="absolute inset-x-0 bottom-0">
                    <div className="h-28 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="line-clamp-2 text-sm font-semibold text-white">
                            {highlight.caption || "No caption"}
                        </p>

                        <div className="mt-3 flex items-center justify-between text-xs text-white/80">
                            <div className="inline-flex items-center gap-4">
                                <span className="inline-flex items-center gap-2">
                                    <Heart className="h-4 w-4" />
                                    {highlight.likes_count ?? 0}
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4" />
                                    {highlight.comments_count ?? 0}
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <Send className="h-4 w-4" />
                                    {highlight.shares_count ?? 0}
                                </span>
                            </div>

                            <span className="text-[11px] opacity-80">
                                {formatShortDate(highlight.created_at)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighlightReelCard;
