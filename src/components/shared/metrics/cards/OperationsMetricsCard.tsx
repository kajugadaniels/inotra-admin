"use client";

import { CalendarCheck, FileText } from "lucide-react";

import type { MetricsResponse } from "@/api/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    data: MetricsResponse | null;
    isLoading: boolean;
};

const OperationsMetricsCard = ({ data, isLoading }: Props) => {
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
                    <Skeleton className="h-24 w-full rounded-2xl" />
                </CardContent>
            </Card>
        );
    }

    const bookings = data?.bookings;
    const subs = data?.submissions;

    return (
        <Card className="rounded-3xl border-border/60 bg-card/70 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <CardHeader className="px-6 pb-0">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm font-semibold text-foreground">Operations</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-background/60 text-muted-foreground">
                        <CalendarCheck className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 px-6">
                <div className="grid gap-3 rounded-2xl border border-border/60 bg-background/60 p-4 text-xs">
                    <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 font-semibold text-foreground">
                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                            Bookings
                        </span>
                        <span className="text-muted-foreground">{(bookings?.total ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 font-semibold text-foreground">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            Listing submissions
                        </span>
                        <span className="text-muted-foreground">{(subs?.listing_submissions?.total ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 font-semibold text-foreground">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            Event submissions
                        </span>
                        <span className="text-muted-foreground">{(subs?.event_submissions?.total ?? 0).toLocaleString()}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default OperationsMetricsCard;

