import type { Highlight } from "@/api/highlights/listHighlights";
import HighlightCard from "./HighlightCard";

type Props = {
    highlights: Highlight[];
    isLoading: boolean;
    onView?: (highlight: Highlight) => void;
    onEdit?: (highlight: Highlight) => void;
    onDelete?: (highlight: Highlight) => void;
};

const HighlightGrid = ({ highlights, isLoading, onView, onEdit, onDelete }: Props) => {
    // Instagram-like grid skeleton while first load
    if (isLoading && highlights.length === 0) {
        return (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={i}
                        className="aspect-square rounded-2xl border border-border/40 bg-muted/40 shadow-sm animate-pulse"
                    />
                ))}
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
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
            {highlights.map((h) => (
                <HighlightCard
                    key={h.id ?? `${h.caption}-${h.created_at}`}
                    highlight={h}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default HighlightGrid;
