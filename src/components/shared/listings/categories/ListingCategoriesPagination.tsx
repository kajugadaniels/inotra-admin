import { Button } from "@/components/ui/button";

type ListingCategoriesPaginationProps = {
    page: number;
    totalPages: number;
    isLoading: boolean;
    onPageChange: (page: number) => void;
};

const ListingCategoriesPagination = ({
    page,
    totalPages,
    isLoading,
    onPageChange,
}: ListingCategoriesPaginationProps) => {
    return (
        <div className="flex items-center justify-between rounded-3xl border border-border/60 bg-card/70 px-5 py-4 text-sm shadow-2xl shadow-black/5 backdrop-blur-xl">
            <p className="text-xs text-muted-foreground">
                Page <span className="font-semibold text-foreground">{page}</span> of {totalPages}
            </p>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    disabled={isLoading || page <= 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    Previous
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    disabled={isLoading || page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default ListingCategoriesPagination;
