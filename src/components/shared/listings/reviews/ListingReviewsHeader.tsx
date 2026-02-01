"use client";

import { Filter, RefreshCw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { ReviewFiltersState } from "./ReviewsFilters";

type ListingReviewsHeaderProps = {
    total: number;
    isLoading: boolean;
    searchValue: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: () => void;
    onRefresh: () => void;
    onReset: () => void;
    filters: ReviewFiltersState;
    onFiltersChange: (next: ReviewFiltersState) => void;
    onApplyFilters: () => void;
};

const ListingReviewsHeader = ({
    total,
    isLoading,
    searchValue,
    onSearchChange,
    onSearchSubmit,
    onRefresh,
    onReset,
    filters,
    onFiltersChange,
    onApplyFilters,
}: ListingReviewsHeaderProps) => {
    return (
        <div className="flex flex-col gap-3 border-b border-border/60 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Listings</p>
                <h1 className="text-2xl font-semibold">Listing reviews</h1>
                <p className="text-sm text-muted-foreground">
                    Moderate reviews across all listings with quick toggles.
                </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                <div className="relative w-full sm:w-64">
                    <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                onSearchSubmit();
                            }
                        }}
                        placeholder="Search comment, place, user"
                        className="pl-10"
                    />
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full">
                            <Filter className="mr-2 h-4 w-4" />
                            Filters
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Filter reviews</DialogTitle>
                        </DialogHeader>
                        <ReviewsFilters
                            filters={filters}
                            isLoading={isLoading}
                            onChange={onFiltersChange}
                            onApply={() => {
                                onApplyFilters();
                            }}
                            onReset={() => {
                                onReset();
                            }}
                        />
                    </DialogContent>
                </Dialog>

                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={onRefresh}
                    disabled={isLoading}
                >
                    <RefreshCw className={isLoading ? "mr-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4"} />
                    Refresh
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    onClick={onReset}
                    disabled={isLoading}
                >
                    Reset
                </Button>
                <div className="hidden items-center rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground sm:flex">
                    {total} results
                </div>
            </div>
        </div>
    );
};

export default ListingReviewsHeader;
