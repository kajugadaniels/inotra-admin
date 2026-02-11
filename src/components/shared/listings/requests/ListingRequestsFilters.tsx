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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type ListingRequestFiltersState = {
    search: string;
    status: "all" | "PENDING" | "APPROVED" | "REJECTED";
    category: "all" | string;
    city: string;
    country: string;
    ordering: "created_at" | "updated_at" | "name" | "status" | "city" | "country";
    sort: "asc" | "desc";
};

export const defaultListingRequestFilters: ListingRequestFiltersState = {
    search: "",
    status: "all",
    category: "all",
    city: "",
    country: "",
    ordering: "created_at",
    sort: "desc",
};

type ListingRequestsFiltersProps = {
    filters: ListingRequestFiltersState;
    categories: PlaceCategory[];
    isLoading: boolean;
    onFiltersChange: (next: ListingRequestFiltersState) => void;
    trigger?: ReactElement;
};

const ListingRequestsFilters = ({
    filters,
    categories,
    isLoading,
    onFiltersChange,
    trigger,
}: ListingRequestsFiltersProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [draftFilters, setDraftFilters] = useState<ListingRequestFiltersState>(filters);

    const handleOpenChange = (open: boolean) => {
        setDialogOpen(open);
        if (open) setDraftFilters(filters);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

            <DialogContent className="max-w-xl rounded-3xl border-border/60 bg-background backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle>Filter listing requests</DialogTitle>
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
                                    ordering: value as ListingRequestFiltersState["ordering"],
                                })
                            }
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created_at">Created date</SelectItem>
                                <SelectItem value="updated_at">Updated date</SelectItem>
                                <SelectItem value="name">Listing name</SelectItem>
                                <SelectItem value="status">Status</SelectItem>
                                <SelectItem value="city">City</SelectItem>
                                <SelectItem value="country">Country</SelectItem>
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
                            Request status
                        </label>
                        <Select
                            value={draftFilters.status}
                            onValueChange={(value) =>
                                setDraftFilters({
                                    ...draftFilters,
                                    status:
                                        value === "PENDING" || value === "APPROVED" || value === "REJECTED"
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
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="APPROVED">Approved</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
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

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                City
                            </label>
                            <Input
                                value={draftFilters.city}
                                onChange={(event) =>
                                    setDraftFilters({ ...draftFilters, city: event.target.value })
                                }
                                className="admin-field mt-2 h-11 rounded-2xl border-border/60 bg-background/60 text-xs"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Country
                            </label>
                            <Input
                                value={draftFilters.country}
                                onChange={(event) =>
                                    setDraftFilters({ ...draftFilters, country: event.target.value })
                                }
                                className="admin-field mt-2 h-11 rounded-2xl border-border/60 bg-background/60 text-xs"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full text-xs mr-5 uppercase font-bold"
                        onClick={() => setDialogOpen(false)}
                    >
                        <XIcon className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="h-11 rounded-full text-xs uppercase font-bold"
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

export default ListingRequestsFilters;
