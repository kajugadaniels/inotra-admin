import { Button } from "@/components/ui/button";

type ListingPaginationProps = {
    page: number;
    totalPages: number;
    isLoading: boolean;
    onPageChange: (page: number) => void;
};

const ListingPagination = ({
    page,
    totalPages,
    isLoading,
    onPageChange,
}: ListingPaginationProps) => (
    <div className="flex items-center justify-between rounded-3xl border border-border/60 bg-card/70 px-5 py-4 text-xs shadow-2xl shadow-black/5 backdrop-blur-xl">
        <p className="text-xs text-muted-foreground">
            Page <span className="font-semibold text-foreground">{page}</span> of {totalPages}
        </p>
        <div className="flex items-center gap-2">
            <Button
                type="button"
                variant="outline"
                className="rounded-full text-xs h-11"
                disabled={isLoading || page <= 1}
                onClick={() => onPageChange(page - 1)}
            >
                Previous
            </Button>
            <Button
                type="button"
                variant="outline"
                className="rounded-full  text-xs h-11"
                disabled={isLoading || page >= totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </Button>
        </div>
    </div>
);

export default ListingPagination;
