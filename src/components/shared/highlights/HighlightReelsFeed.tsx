"use client";

import { useCallback, useRef } from "react";
import type { Highlight } from "@/api/highlights/listHighlights";
import { Loader2 } from "lucide-react";
import HighlightReelCard from "./HighlightReelCard";

type Props = {
    highlights: Highlight[];
    isLoading: boolean;
    isLoadingMore: boolean;
    hasNext: boolean;
    onLoadMore: () => void;

    onView?: (highlight: Highlight) => void;
    onEdit?: (highlight: Highlight) => void;
    onDelete?: (highlight: Highlight) => void;
};

const HighlightReelsFeed = ({
    highlights,
    isLoading,
    isLoadingMore,
    hasNext,
    onLoadMore,
    onView,
    onEdit,
    onDelete,
}: Props) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleScroll = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;

        const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
        if (remaining < 900 && hasNext && !isLoading && !isLoadingMore) {
            onLoadMore();
        }
    }, [hasNext, isLoading, isLoadingMore, onLoadMore]);

    if (isLoading && highlights.length === 0) {
        return (
            <div className="rounded-3xl border border-border/60 bg-card/70 p-10 text-center text-xs text-muted-foreground shadow-2xl shadow-black/5 backdrop-blur-xl">
                Loading reels...
            </div>
        );
    }

    if (!highlights.length) {
        return (
            <div className="rounded-3xl border border-border/60 bg-card/70 p-10 text-center text-xs text-muted-foreground shadow-2xl shadow-black/5 backdrop-blur-xl">
                No highlights found.
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="max-h-[calc(100vh-320px)] min-h-[520px] overflow-y-auto px-4 py-2 snap-y snap-mandatory"
            >
                {highlights.map((h) => (
                    <HighlightReelCard
                        key={h.id ?? `${h.caption}-${h.created_at}`}
                        highlight={h}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}

                {isLoadingMore ? (
                    <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading more…
                    </div>
                ) : null}

                {!hasNext ? (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                        End of feed ✨
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default HighlightReelsFeed;
