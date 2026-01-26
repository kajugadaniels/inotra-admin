import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export type UsersPaginationProps = {
    page: number;
    totalPages: number;
    isLoading: boolean;
    onPageChange: (page: number) => void;
};

const UsersPagination = ({ page, totalPages, isLoading, onPageChange }: UsersPaginationProps) => {
    if (totalPages <= 1) return null;

    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 px-4 py-3 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                    Page {page} of {totalPages}
                </p>
                <Pagination className="mx-0 w-auto justify-start">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault();
                                    if (isLoading || page <= 1) return;
                                    onPageChange(page - 1);
                                }}
                                className={page <= 1 || isLoading ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault();
                                    if (isLoading || page >= totalPages) return;
                                    onPageChange(page + 1);
                                }}
                                className={page >= totalPages || isLoading ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default UsersPagination;
