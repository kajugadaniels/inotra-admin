"use client";

import { Filter, RefreshCw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReviewsFilters, { type ReviewFiltersState } from "./ReviewsFilters";

type ListingReviewsHeaderProps = {
    total: number;
    isLoading: boolean;
    filters: ReviewFiltersState;
    onFiltersChange: (next: ReviewFiltersState) => void;
    onApplyFilters: () => void;
    onRefresh: () => void;
    onReset: () => void;
};

const ListingReviewsHeader = ({
    total,
    isLoading,
    filters,
    onFiltersChange,
    onApplyFilters,
    onRefresh,
    onReset,
}: ListingReviewsHeaderProps) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Listings
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
                        Listing reviews
                    </h1>
                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                        Moderate reviews across all listings with quick toggles.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-3 lg:w-auto lg:items-end">
                    <div className="flex flex-wrap items-center gap-2">
                        <ReviewsFilters
                            filters={filters}
                            isLoading={isLoading}
                            onFiltersChange={onFiltersChange}
                            onApply={onApplyFilters}
                            onReset={onReset}
                            trigger={
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 rounded-full border-border/60 bg-background/70 text-xs shadow-sm hover:bg-background"
                                    disabled={isLoading}
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filters
                                </Button>
                            }
                        />

                        <Button
                            type="button"
                            variant="outline"
                            className="h-11 rounded-full text-xs"
                            onClick={onRefresh}
                            disabled={isLoading}
                        >
                            <RefreshCw className={isLoading ? "mr-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4"} />
                            Refresh
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            className="h-11 rounded-full text-xs uppercase tracking-[0.2em] text-muted-foreground"
                            onClick={onReset}
                            disabled={isLoading}
                        >
                            Reset
                        </Button>

                        <div className="hidden items-center rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground sm:flex">
                            {total} results
                        </div>
                    </div>

                    <div className="relative w-full sm:w-[360px]">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={filters.search}
                            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                            placeholder="Search comment, place, user"
                            className="admin-field h-11 rounded-2xl border-border/60 bg-background/60 pl-10 text-xs"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingReviewsHeader;
