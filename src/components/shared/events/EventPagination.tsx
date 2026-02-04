import { Button } from "@/components/ui/button";

type Props = {
    page: number;
    totalPages: number;
    isLoading: boolean;
    onPageChange: (page: number) => void;
};

const EventPagination = ({ page, totalPages, isLoading, onPageChange }: Props) => {
    return (
        <div className="flex items-center justify-between gap-4 rounded-3xl border border-border/60 bg-card/70 px-4 py-3 text-sm text-muted-foreground shadow-2xl shadow-black/5 backdrop-blur-xl">
            <span>
                Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    disabled={page <= 1 || isLoading}
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    disabled={page >= totalPages || isLoading}
                    onClick={() => onPageChange(page + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default EventPagination;
