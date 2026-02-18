"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { MapPin } from "lucide-react";

import type { MetricsResponse } from "@/api/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type Props = {
    data: MetricsResponse;
};

const ListingsByCategoryChartCard = ({ data }: Props) => {
    const rows = (data.listings.by_category ?? [])
        .slice(0, 10)
        .map((row) => ({
            name: row.category_name || "Uncategorized",
            total: row.total ?? 0,
        }));

    return (
        <Card className="rounded-3xl border-border/60 bg-card/70 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <CardHeader className="px-6 pb-0">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm font-semibold text-foreground">Listings by category</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-background/60 text-muted-foreground">
                        <MapPin className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-6">
                <ChartContainer
                    className="mt-4 h-[260px] w-full"
                    config={{
                        total: { label: "Listings", color: "hsl(var(--primary))" },
                    }}
                >
                    <BarChart data={rows} margin={{ left: 4, right: 10, top: 8, bottom: 0 }}>
                        <defs>
                            <linearGradient id="listingsTotal" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-total)" stopOpacity={0.95} />
                                <stop offset="100%" stopColor="var(--color-total)" stopOpacity={0.3} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} tick={{ fontSize: 10 }} />
                        <YAxis tickLine={false} axisLine={false} width={36} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="total" fill="url(#listingsTotal)" radius={[10, 10, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default ListingsByCategoryChartCard;

