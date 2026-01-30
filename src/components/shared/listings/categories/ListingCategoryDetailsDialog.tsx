import type { PlaceCategory } from "@/api/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const formatDate = (value?: string | null) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
};

type ListingCategoryDetailsDialogProps = {
    category: PlaceCategory | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const ListingCategoryDetailsDialog = ({
    category,
    open,
    onOpenChange,
}: ListingCategoryDetailsDialogProps) => {
    const name = category?.name || "Untitled category";
    const icon = category?.icon || "--";
    const status = category?.is_active ?? true;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Listing category details</DialogTitle>
                    <DialogDescription className="text-xs">
                        Review the metadata for this listing category.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 text-xs">
                    <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Category name
                        </p>
                        <p className="mt-2 text- font-semibold text-foreground">{name}</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Icon
                            </p>
                            <p className="mt-2 text-xs font-semibold text-foreground">{icon}</p>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Status
                            </p>
                            <p className="mt-2 text-xs font-semibold text-foreground">
                                {status ? "Active" : "Inactive"}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Created
                            </p>
                            <p className="mt-2 text-xs font-semibold text-foreground">
                                {formatDate(category?.created_at)}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Updated
                            </p>
                            <p className="mt-2 text-xs font-semibold text-foreground">
                                {formatDate(category?.updated_at)}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ListingCategoryDetailsDialog;
