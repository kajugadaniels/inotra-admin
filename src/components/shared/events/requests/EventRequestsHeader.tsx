"use client";

import { Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EventRequestsFilters, { type EventRequestFiltersState } from "./EventRequestsFilters";

type Props = {
    filters: EventRequestFiltersState;
    isLoading: boolean;
    onFiltersChange: (next: EventRequestFiltersState) => void;
    onReset: () => void;
};

const EventRequestsHeader = ({ filters, isLoading, onFiltersChange, onReset }: Props) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Event submissions
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
                        Event requests
                    </h1>
                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                        Review incoming event submissions and track approval status.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-3 lg:w-auto lg:items-end">
                    <div className="flex flex-wrap items-center gap-2">
                        <EventRequestsFilters
                            filters={filters}
                            isLoading={isLoading}
                            onFiltersChange={onFiltersChange}
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
                    </div>

                    <div className="relative w-full sm:w-[380px]">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={filters.search}
                            onChange={(event) =>
                                onFiltersChange({ ...filters, search: event.target.value })
                            }
                            placeholder="Search submissions by title, city, or submitter"
                            className="admin-field h-11 rounded-2xl border-border/60 bg-background/60 pl-10 text-xs"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventRequestsHeader;

