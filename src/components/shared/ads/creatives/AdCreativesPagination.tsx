import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type AdCreativesPaginationProps = {
    page: number;
    totalPages: number;
    isLoading: boolean;
    onPageChange: (page: number) => void;
};

const AdCreativesPagination = ({
    page,
    totalPages,
    isLoading,
    onPageChange,
}: AdCreativesPaginationProps) => {
    const canGoBack = page > 1;
    const canGoForward = page < totalPages;

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border/60 bg-card/70 p-4 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    disabled={!canGoBack || isLoading}
                    onClick={() => onPageChange(page - 1)}
                    className="h-11 rounded-full"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    disabled={!canGoForward || isLoading}
                    onClick={() => onPageChange(page + 1)}
                    className="h-11 rounded-full"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default AdCreativesPagination;
