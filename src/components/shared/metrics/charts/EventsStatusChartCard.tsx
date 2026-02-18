"use client";

import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { PartyPopper } from "lucide-react";

import type { MetricsResponse } from "@/api/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type Props = {
    data: MetricsResponse;
};

const EventsStatusChartCard = ({ data }: Props) => {
    const events = data.events;
    const rows = [
        { key: "Active", value: events.active ?? 0 },
        { key: "Inactive", value: events.inactive ?? 0 },
        { key: "Verified", value: events.verified ?? 0 },
        { key: "Unverified", value: events.unverified ?? 0 },
    ];

    return (
        <Card className="rounded-3xl border-border/60 bg-card/70 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <CardHeader className="px-6 pb-0">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm font-semibold text-foreground">Events status snapshot</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-background/60 text-muted-foreground">
                        <PartyPopper className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-6">
                <ChartContainer
                    className="mt-4 h-[260px] w-full"
                    config={{
                        value: { label: "Count", color: "hsl(var(--primary))" },
                    }}
                >
                    <AreaChart data={rows} margin={{ left: 4, right: 10, top: 8, bottom: 0 }}>
                        <defs>
                            <linearGradient id="eventsArea" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.85} />
                                <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0.15} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="key" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} width={36} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="var(--color-value)"
                            fill="url(#eventsArea)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default EventsStatusChartCard;

