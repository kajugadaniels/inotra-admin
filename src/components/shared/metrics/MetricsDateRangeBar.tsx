"use client";

import { CalendarDays, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
    startDate: string;
    endDate: string;
    timezoneLabel?: string | null;
    isLoading?: boolean;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onApply: () => void;
    onReset: () => void;
};

const MetricsDateRangeBar = ({
    startDate,
    endDate,
    timezoneLabel,
    isLoading,
    onStartDateChange,
    onEndDateChange,
    onApply,
    onReset,
}: Props) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-5 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Date range
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Filter metrics by date. Default range covers earliest available data through today.
                        {timezoneLabel ? <span className="ml-2 text-xs">({timezoneLabel})</span> : null}
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:items-center">
                    <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => onStartDateChange(e.target.value)}
                            className="h-11 rounded-2xl border-border/60 bg-background/60 pl-10 shadow-sm"
                            disabled={isLoading}
                            aria-label="Start date"
                        />
                    </div>
                    <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => onEndDateChange(e.target.value)}
                            className="h-11 rounded-2xl border-border/60 bg-background/60 pl-10 shadow-sm"
                            disabled={isLoading}
                            aria-label="End date"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            className="h-11 rounded-2xl px-5"
                            onClick={onApply}
                            disabled={Boolean(isLoading)}
                        >
                            Apply
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className={cn("h-11 rounded-2xl border-border/60 bg-background/60 px-4")}
                            onClick={onReset}
                            disabled={Boolean(isLoading)}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetricsDateRangeBar;

