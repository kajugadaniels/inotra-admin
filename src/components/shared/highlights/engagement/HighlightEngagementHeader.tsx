"use client";

import { Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import HighlightEngagementFilters from "./HighlightEngagementFilters";
import type {
    HighlightEngagementFiltersState,
    HighlightEngagementTab,
} from "./types";

type Props = {
    tab: HighlightEngagementTab;
    total: number;
    isLoading: boolean;
    filters: HighlightEngagementFiltersState;
    onTabChange: (tab: HighlightEngagementTab) => void;
    onFiltersChange: (next: HighlightEngagementFiltersState) => void;
    onApply: () => void;
    onReset: () => void;
};

const HighlightEngagementHeader = ({
    tab,
    total,
    isLoading,
    filters,
    onTabChange,
    onFiltersChange,
    onApply,
    onReset,
}: Props) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Highlights
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
                        Engagement
                    </h2>
                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                        Audit likes, comments, and shares across highlights. Search globally or refine with filters.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-3 lg:w-auto lg:items-end">
                    <div className="flex flex-wrap items-center gap-2">
                        <HighlightEngagementFilters
                            filters={filters}
                            isLoading={isLoading}
                            onFiltersChange={onFiltersChange}
                            onApply={onApply}
                            onReset={onReset}
                            trigger={
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 rounded-full text-xs uppercase font-bold"
                                    disabled={isLoading}
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filters
                                </Button>
                            }
                        />

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
                            onChange={(e) =>
                                onFiltersChange({ ...filters, search: e.target.value })
                            }
                            placeholder="Search user, listing, event, channel, text"
                            className="admin-field h-11 rounded-2xl border-border/60 bg-background/60 pl-10 text-xs"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-5 inline-flex w-full rounded-full border border-border/60 bg-background/50 p-1 sm:w-auto">
                {(
                    [
                        ["likes", "Likes"],
                        ["comments", "Comments"],
                        ["shares", "Shares"],
                    ] as const
                ).map(([key, label]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => onTabChange(key)}
                        className={cn(
                            "inline-flex h-10 flex-1 items-center justify-center rounded-full px-4 text-xs font-semibold transition sm:flex-none",
                            tab === key
                                ? "bg-foreground text-background"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HighlightEngagementHeader;

