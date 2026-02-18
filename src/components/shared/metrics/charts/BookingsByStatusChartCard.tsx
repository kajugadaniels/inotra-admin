"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { CalendarCheck } from "lucide-react";

import type { MetricsResponse } from "@/api/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type Props = {
    data: MetricsResponse;
};

const BookingsByStatusChartCard = ({ data }: Props) => {
    const rows = (data.bookings.by_status ?? []).map((row) => ({
        status: (row.status || "UNKNOWN").toString(),
        total: row.total ?? 0,
    }));

    return (
        <Card className="rounded-3xl border-border/60 bg-card/70 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <CardHeader className="px-6 pb-0">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm font-semibold text-foreground">Bookings by status</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-background/60 text-muted-foreground">
                        <CalendarCheck className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-6">
                <ChartContainer
                    className="mt-4 h-[260px] w-full"
                    config={{
                        total: { label: "Bookings", color: "hsl(var(--primary))" },
                    }}
                >
                    <BarChart data={rows} margin={{ left: 4, right: 10, top: 8, bottom: 0 }}>
                        <defs>
                            <linearGradient id="bookingsTotal" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-total)" stopOpacity={0.95} />
                                <stop offset="100%" stopColor="var(--color-total)" stopOpacity={0.25} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="status" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} width={36} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="total" fill="url(#bookingsTotal)" radius={[10, 10, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default BookingsByStatusChartCard;

