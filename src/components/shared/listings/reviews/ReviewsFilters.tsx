"use client";

import { useState, type ReactElement } from "react";
import { Filter, XIcon } from "lucide-react";

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

export type ReviewFiltersState = {
    search: string;
    is_reported: "all" | "true" | "false";
    published: "all" | "true" | "false";
    rating: "all" | "5" | "4" | "3" | "2" | "1";
    sort: "desc" | "asc";
    ordering: "created_at" | "rating";
};

export const defaultReviewFilters: ReviewFiltersState = {
    search: "",
    is_reported: "all",
    published: "all",
    rating: "all",
    sort: "desc",
    ordering: "created_at",
};

type Props = {
    filters: ReviewFiltersState;
    isLoading: boolean;
    onFiltersChange: (next: ReviewFiltersState) => void;
    onApply: () => void;
    onReset: () => void;
    trigger?: ReactElement;
};

const ReviewsFilters = ({ filters, isLoading, onFiltersChange, onApply, onReset, trigger }: Props) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [draft, setDraft] = useState<ReviewFiltersState>(filters);

    const handleOpenChange = (open: boolean) => {
        setDialogOpen(open);
        if (open) setDraft(filters);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

            <DialogContent className="max-w-xl rounded-3xl border-border/60 bg-background/80 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle>Filter reviews</DialogTitle>
                    <DialogDescription className="text-xs">
                        Adjust the filters below and click apply.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Reported
                        </label>
                        <Select
                            value={draft.is_reported}
                            onValueChange={(value) =>
                                setDraft({
                                    ...draft,
                                    is_reported: value as ReviewFiltersState["is_reported"],
                                })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any</SelectItem>
                                <SelectItem value="true">Reported</SelectItem>
                                <SelectItem value="false">Clean</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Published
                        </label>
                        <Select
                            value={draft.published}
                            onValueChange={(value) =>
                                setDraft({
                                    ...draft,
                                    published: value as ReviewFiltersState["published"],
                                })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any</SelectItem>
                                <SelectItem value="true">Published</SelectItem>
                                <SelectItem value="false">Unpublished</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Rating
                        </label>
                        <Select
                            value={draft.rating}
                            onValueChange={(value) =>
                                setDraft({
                                    ...draft,
                                    rating: value as ReviewFiltersState["rating"],
                                })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="1">1</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Sort direction
                        </label>
                        <Select
                            value={draft.sort}
                            onValueChange={(value) =>
                                setDraft({ ...draft, sort: value === "asc" ? "asc" : "desc" })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Newest" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Newest</SelectItem>
                                <SelectItem value="asc">Oldest</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Order by
                        </label>
                        <Select
                            value={draft.ordering}
                            onValueChange={(value) =>
                                setDraft({
                                    ...draft,
                                    ordering: value as ReviewFiltersState["ordering"],
                                })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Created at" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created_at">Created at</SelectItem>
                                <SelectItem value="rating">Rating</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full text-xs"
                        onClick={() => setDialogOpen(false)}
                        disabled={isLoading}
                    >
                        <XIcon className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        className="h-11 rounded-full text-xs"
                        onClick={() => {
                            onFiltersChange(draft);
                            onApply();
                            setDialogOpen(false);
                        }}
                        disabled={isLoading}
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Apply filters
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="h-11 rounded-full text-xs"
                        onClick={() => {
                            onReset();
                            setDialogOpen(false);
                        }}
                        disabled={isLoading}
                    >
                        Reset
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewsFilters;
