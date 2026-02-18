"use client";

import { VanIcon } from "lucide-react";

import type { MetricsResponse } from "@/api/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    data: MetricsResponse | null;
    isLoading: boolean;
};

const TripPackagesMetricsCard = ({ data, isLoading }: Props) => {
    if (isLoading) {
        return (
            <Card className="rounded-3xl border-border/60 bg-card/70 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <CardHeader className="px-6 pb-0">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-9 w-9 rounded-2xl" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 px-6">
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-20 w-full rounded-2xl" />
                </CardContent>
            </Card>
        );
    }

    const packs = data?.trip_packages;
    const total = packs?.total ?? 0;
    const active = packs?.active ?? 0;

    return (
        <Card className="rounded-3xl border-border/60 bg-card/70 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <CardHeader className="px-6 pb-0">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm font-semibold text-foreground">Trip packages</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-background/60 text-muted-foreground">
                        <VanIcon className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 px-6">
                <div>
                    <p className="text-3xl font-semibold text-foreground">{total.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {active.toLocaleString()} active · {(packs?.inactive ?? 0).toLocaleString()} inactive
                    </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/60 p-4 text-xs text-muted-foreground">
                    Counts reflect packages created within the selected date range.
                </div>
            </CardContent>
        </Card>
    );
};

export default TripPackagesMetricsCard;

