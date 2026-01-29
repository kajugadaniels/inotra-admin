import { Filter, Search } from "lucide-react";
import { useState } from "react";

import type { PlaceCategory } from "@/api/types";
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

export type ListingFiltersState = {
    search: string;
    ordering: "created_at" | "name" | "city" | "country" | "avg_rating" | "reviews_count";
    sort: "asc" | "desc";
    isActive: "all" | "true" | "false";
    isVerified: "all" | "true" | "false";
    category: "all" | string;
};

type ListingFiltersProps = {
    filters: ListingFiltersState;
    categories: PlaceCategory[];
    isLoading: boolean;
    onFiltersChange: (next: ListingFiltersState) => void;
    onReset: () => void;
};

const ListingFilters = ({
    filters,
    categories,
    isLoading,
    onFiltersChange,
    onReset,
}: ListingFiltersProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [draftFilters, setDraftFilters] = useState<ListingFiltersState>(filters);

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
                    <p className="text-sm font-semibold text-foreground">Filters</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Refine listings by category, status, and verification.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
                        <DialogTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-full border-border/60 bg-background/70"
                                disabled={isLoading}
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                Filters
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                            <DialogHeader>
                                <DialogTitle>Filter listings</DialogTitle>
                                <DialogDescription>
                                    Adjust the filters below and click apply.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                        Sort by
                                    </label>
                                    <Select
                                        value={draftFilters.ordering}
                                        onValueChange={(value) =>
                                            setDraftFilters({
                                                ...draftFilters,
                                                ordering: value as ListingFiltersState["ordering"],
                                            })
                                        }
                                    >
                                        <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60">
                                            <SelectValue placeholder="Sort" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="created_at">Created date</SelectItem>
                                            <SelectItem value="name">Listing name</SelectItem>
                                            <SelectItem value="city">City</SelectItem>
                                            <SelectItem value="country">Country</SelectItem>
                                            <SelectItem value="avg_rating">Rating</SelectItem>
                                            <SelectItem value="reviews_count">Reviews</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                        Sort direction
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
                                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                        Listing category
                                    </label>
                                    <Select
                                        value={draftFilters.category}
                                        onValueChange={(value) =>
                                            setDraftFilters({
                                                ...draftFilters,
                                                category: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All categories</SelectItem>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={String(category.id)}>
                                                    {category.name ?? "Untitled"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
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
                                        <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All status</SelectItem>
                                            <SelectItem value="true">Active</SelectItem>
                                            <SelectItem value="false">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                        Verification
                                    </label>
                                    <Select
                                        value={draftFilters.isVerified}
                                        onValueChange={(value) =>
                                            setDraftFilters({
                                                ...draftFilters,
                                                isVerified:
                                                    value === "true" || value === "false"
                                                        ? value
                                                        : "all",
                                            })
                                        }
                                    >
                                        <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60">
                                            <SelectValue placeholder="Verification" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All verification</SelectItem>
                                            <SelectItem value="true">Verified</SelectItem>
                                            <SelectItem value="false">Unverified</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 rounded-full"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    className="h-11 rounded-full"
                                    onClick={() => {
                                        onFiltersChange(draftFilters);
                                        setDialogOpen(false);
                                    }}
                                    disabled={isLoading}
                                >
                                    Apply filters
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        type="button"
                        variant="ghost"
                        className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                        onClick={onReset}
                        disabled={isLoading}
                    >
                        Reset
                    </Button>
                </div>
            </div>

            <div className="mt-4">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={filters.search}
                        onChange={(event) =>
                            onFiltersChange({ ...filters, search: event.target.value })
                        }
                        placeholder="Search listings by name or location"
                        className="admin-field rounded-2xl border-border/60 bg-background/60 pl-10"
                        disabled={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default ListingFilters;
