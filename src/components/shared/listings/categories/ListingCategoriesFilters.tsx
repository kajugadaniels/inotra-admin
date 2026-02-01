import { Filter, Search, XIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type ListingCategoriesFiltersState = {
    search: string;
    sort: "asc" | "desc";
    isActive: "all" | "true" | "false";
};

type ListingCategoriesFiltersProps = {
    filters: ListingCategoriesFiltersState;
    isLoading: boolean;
    onFiltersChange: (next: ListingCategoriesFiltersState) => void;
    onReset: () => void;
};

const ListingCategoriesFilters = ({
    filters,
    isLoading,
    onFiltersChange,
    onReset,
}: ListingCategoriesFiltersProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [draftFilters, setDraftFilters] = useState<ListingCategoriesFiltersState>(
        filters
    );

    const handleOpenChange = (open: boolean) => {
        setDialogOpen(open);
        if (open) {
            setDraftFilters(filters);
        }
    };

    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-5 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold text-foreground">Filters</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Refine listing categories by status or sorting.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
                        <DialogTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-full border-border/60 bg-background/70 h-11 text-xs"
                                disabled={isLoading}
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                Filters
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                            <DialogHeader>
                                <DialogTitle>Filter listing categories</DialogTitle>
                                <DialogDescription>
                                    Adjust the filters below and click apply.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                        Sort by
                                    </label>
                                    <Select
                                        value={draftFilters.sort}
                                        onValueChange={(value) =>
                                            setDraftFilters({
                                                ...draftFilters,
                                                sort: value === "asc" ? "asc" : "desc",
                                            })
                                        }
                                    >
                                        <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60">
                                            <SelectValue placeholder="Sort" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="desc">Newest first</SelectItem>
                                            <SelectItem value="asc">Oldest first</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                        Status
                                    </label>
                                    <Select
                                        value={draftFilters.isActive}
                                        onValueChange={(value) =>
                                            setDraftFilters({
                                                ...draftFilters,
                                                isActive:
                                                    value === "true" || value === "false"
                                                        ? value
                                                        : "all",
                                            })
                                        }
                                    >
                                        <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All status</SelectItem>
                                            <SelectItem value="true">Active</SelectItem>
                                            <SelectItem value="false">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 rounded-full text-xs h-11"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    <XIcon className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    className="h-11 rounded-full text-xs h-11"
                                    onClick={() => {
                                        onFiltersChange(draftFilters);
                                        setDialogOpen(false);
                                    }}
                                    disabled={isLoading}
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Apply filters
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        type="button"
                        variant="ghost"
                        className="text-xs uppercase tracking-[0.2em] text-muted-foreground h-11 rounded-full"
                        onClick={onReset}
                        disabled={isLoading}
                    >
                        Reset
                    </Button>
                </div>
            </div>

            <div className="mt-4">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground text-xs" />
                    <Input
                        value={filters.search}
                        onChange={(event) =>
                            onFiltersChange({ ...filters, search: event.target.value })
                        }
                        placeholder="Search category name or icon"
                        className="admin-field rounded-2xl border-border/60 bg-background/60 pl-10 text-xs"
                        disabled={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default ListingCategoriesFilters;
