"use client";

import { MapPin } from "lucide-react";

import type { MetricsResponse } from "@/api/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    data: MetricsResponse | null;
    isLoading: boolean;
};

const ListingsMetricsCard = ({ data, isLoading }: Props) => {
    if (isLoading) {
        return (
            <Card className="rounded-3xl border-border/60 bg-card/70 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <CardHeader className="px-6 pb-0">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
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

    const listings = data?.listings;
    const total = listings?.total ?? 0;
    const active = listings?.active ?? 0;
    const verified = listings?.verified ?? 0;

    const topCategories = (listings?.by_category ?? []).slice(0, 3);

    return (
        <Card className="rounded-3xl border-border/60 bg-card/70 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <CardHeader className="px-6 pb-0">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm font-semibold text-foreground">Listings</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-background/60 text-muted-foreground">
                        <MapPin className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 px-6">
                <div>
                    <p className="text-3xl font-semibold text-foreground">{total.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {active.toLocaleString()} active · {verified.toLocaleString()} verified
                    </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/60 p-4 text-xs">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Top categories
                    </p>
                    <div className="mt-3 space-y-2">
                        {topCategories.length === 0 ? (
                            <p className="text-muted-foreground">No category data available.</p>
                        ) : (
                            topCategories.map((c) => (
                                <div key={c.category_id ?? c.category_name} className="flex items-center justify-between gap-3">
                                    <span className="truncate font-semibold text-foreground">{c.category_name}</span>
                                    <span className="shrink-0 text-muted-foreground">{c.total.toLocaleString()}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ListingsMetricsCard;

