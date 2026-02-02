"use client";

import { Filter, XIcon } from "lucide-react";
import { useState, type ReactElement } from "react";

import type { PlaceCategory } from "@/api/types";
import { Button } from "@/components/ui/button";
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

export const defaultListingFilters: ListingFiltersState = {
    search: "",
    ordering: "created_at",
    sort: "desc",
    isActive: "all",
    isVerified: "all",
    category: "all",
};

type ListingFiltersProps = {
    filters: ListingFiltersState;
    categories: PlaceCategory[];
    isLoading: boolean;
    onFiltersChange: (next: ListingFiltersState) => void;
    trigger?: ReactElement;
};

const ListingFilters = ({ filters, categories, isLoading, onFiltersChange, trigger }: ListingFiltersProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [draftFilters, setDraftFilters] = useState<ListingFiltersState>(filters);

    const handleOpenChange = (open: boolean) => {
        setDialogOpen(open);
        if (open) setDraftFilters(filters);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

            <DialogContent className="max-w-xl rounded-3xl border-border/60 bg-background/80 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle>Filter listings</DialogTitle>
                    <DialogDescription className="text-xs">
                        Adjust the filters below and click apply.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
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
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
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
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
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
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
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
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
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
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Status
                        </label>
                        <Select
                            value={draftFilters.isActive}
                            onValueChange={(value) =>
                                setDraftFilters({
                                    ...draftFilters,
                                    isActive:
                                        value === "true" || value === "false" ? value : "all",
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

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Verification
                        </label>
                        <Select
                            value={draftFilters.isVerified}
                            onValueChange={(value) =>
                                setDraftFilters({
                                    ...draftFilters,
                                    isVerified:
                                        value === "true" || value === "false" ? value : "all",
                                })
                            }
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
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

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full text-xs"
                        onClick={() => setDialogOpen(false)}
                    >
                        <XIcon className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="h-11 rounded-full text-xs"
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
    );
};

export default ListingFilters;
