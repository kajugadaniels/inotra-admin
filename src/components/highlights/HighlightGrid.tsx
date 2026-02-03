import type { Highlight } from "@/api/highlights/listHighlights";
import HighlightCard from "./HighlightCard";

type Props = {
    highlights: Highlight[];
    isLoading: boolean;
    onView?: (highlight: Highlight) => void;
    onDelete?: (highlight: Highlight) => void;
};

const HighlightGrid = ({ highlights, isLoading, onView, onDelete }: Props) => {
    if (isLoading) {
        return (
            <div className="rounded-3xl border border-border/60 bg-card/70 p-10 text-center text-xs text-muted-foreground shadow-2xl shadow-black/5">
                Loading highlights...
            </div>
        );
    }

    if (!highlights.length) {
        return (
            <div className="rounded-3xl border border-border/60 bg-card/70 p-10 text-center text-xs text-muted-foreground shadow-2xl shadow-black/5">
                No highlights found.
            </div>
        );
    }

    return (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {highlights.map((h) => (
                <HighlightCard key={h.id ?? h.caption} highlight={h} onView={onView} onDelete={onDelete} />
            ))}
        </div>
    );
};

export default HighlightGrid;
