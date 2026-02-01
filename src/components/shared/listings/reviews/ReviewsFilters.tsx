"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    DialogClose,
    DialogFooter,
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

type Props = {
    filters: ReviewFiltersState;
    isLoading: boolean;
    onChange: (next: ReviewFiltersState) => void;
    onApply: () => void;
    onReset: () => void;
};

const ReviewsFilters = ({ filters, isLoading, onChange, onApply, onReset }: Props) => {
    const [draft, setDraft] = useState<ReviewFiltersState>(filters);

    useEffect(() => {
        setDraft(filters);
    }, [filters]);

    const handleApply = () => {
        onChange(draft);
        onApply();
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Reported
                </label>
                <Select
                    value={draft.is_reported}
                    onValueChange={(value) =>
                        setDraft({ ...draft, is_reported: value as ReviewFiltersState["is_reported"] })
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
                        setDraft({ ...draft, published: value as ReviewFiltersState["published"] })
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
                        setDraft({ ...draft, rating: value as ReviewFiltersState["rating"] })
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
                        setDraft({ ...draft, ordering: value as ReviewFiltersState["ordering"] })
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

            <DialogFooter className="gap-2 pt-2">
                <DialogClose asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full text-xs"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                </DialogClose>
                <Button
                    type="button"
                    className="h-11 rounded-full text-xs"
                    onClick={handleApply}
                    disabled={isLoading}
                >
                    Apply filters
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    className="h-11 rounded-full text-xs"
                    onClick={() => {
                        onReset();
                        setDraft(filters);
                    }}
                    disabled={isLoading}
                >
                    Reset
                </Button>
            </DialogFooter>
        </div>
    );
};

export default ReviewsFilters;
