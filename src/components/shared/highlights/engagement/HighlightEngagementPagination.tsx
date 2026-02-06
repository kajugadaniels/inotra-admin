import { Button } from "@/components/ui/button";

type Props = {
    page: number;
    totalPages: number;
    isLoading: boolean;
    onPageChange: (page: number) => void;
};

const HighlightEngagementPagination = ({ page, totalPages, isLoading, onPageChange }: Props) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border/60 bg-card/70 px-5 py-4 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <p className="text-xs text-muted-foreground">
                Page <span className="font-semibold text-foreground">{page}</span> of{" "}
                <span className="font-semibold text-foreground">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-full text-xs"
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={isLoading || page <= 1}
                >
                    Previous
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-full text-xs"
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={isLoading || page >= totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default HighlightEngagementPagination;

