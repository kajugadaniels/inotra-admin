"use client";

import { Filter, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    const [search, setSearch] = useState(filters.search);

    return (
        <aside className="rounded-3xl border border-border/60 bg-card/60 p-5 shadow-[0_20px_60px_-45px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-2 text-sm font-semibold">
                <Filter className="h-4 w-4 text-primary" />
                Filters
            </div>

            <div className="mt-4 space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Search
                    </label>
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    onChange({ ...filters, search: search.trim() });
                                    onApply();
                                }
                            }}
                            placeholder="Search comment, place, user"
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Reported
                        </label>
                        <Select
                            value={filters.is_reported}
                            onValueChange={(value) =>
                                onChange({ ...filters, is_reported: value as ReviewFiltersState["is_reported"] })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any</SelectItem>
                                <SelectItem value="true">Reported</SelectItem>
                                <SelectItem value="false">Clean</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Published
                        </label>
                        <Select
                            value={filters.published}
                            onValueChange={(value) =>
                                onChange({ ...filters, published: value as ReviewFiltersState["published"] })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any</SelectItem>
                                <SelectItem value="true">Published</SelectItem>
                                <SelectItem value="false">Unpublished</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Rating
                        </label>
                        <Select
                            value={filters.rating}
                            onValueChange={(value) =>
                                onChange({ ...filters, rating: value as ReviewFiltersState["rating"] })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-full">
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
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Sort
                        </label>
                        <Select
                            value={filters.sort}
                            onValueChange={(value) =>
                                onChange({ ...filters, sort: value as "asc" | "desc" })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Newest" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Newest</SelectItem>
                                <SelectItem value="asc">Oldest</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Order by
                    </label>
                    <Select
                        value={filters.ordering}
                        onValueChange={(value) =>
                            onChange({ ...filters, ordering: value as "created_at" | "rating" })
                        }
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="created_at" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="created_at">Created at</SelectItem>
                            <SelectItem value="rating">Rating</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                    <Button
                        size="sm"
                        className="flex-1 rounded-full"
                        disabled={isLoading}
                        onClick={() => {
                            onChange({ ...filters, search: search.trim() });
                            onApply();
                        }}
                    >
                        Apply
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full"
                        disabled={isLoading}
                        onClick={() => {
                            setSearch("");
                            onReset();
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </aside>
    );
};

export default ReviewsFilters;
