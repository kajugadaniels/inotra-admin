"use client";

import { PartyPopper } from "lucide-react";

import type { MetricsResponse } from "@/api/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    data: MetricsResponse | null;
    isLoading: boolean;
};

const EventsMetricsCard = ({ data, isLoading }: Props) => {
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

    const events = data?.events;
    const total = events?.total ?? 0;
    const active = events?.active ?? 0;
    const verified = events?.verified ?? 0;

    return (
        <Card className="rounded-3xl border-border/60 bg-card/70 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <CardHeader className="px-6 pb-0">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm font-semibold text-foreground">Events</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-background/60 text-muted-foreground">
                        <PartyPopper className="h-5 w-5" />
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

                <div className="grid gap-2 rounded-2xl border border-border/60 bg-background/60 p-4 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">Inactive</span>
                        <span className="text-muted-foreground">{(events?.inactive ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">Unverified</span>
                        <span className="text-muted-foreground">{(events?.unverified ?? 0).toLocaleString()}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EventsMetricsCard;

