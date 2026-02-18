"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { MessageCircle } from "lucide-react";

import type { MetricsResponse } from "@/api/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type Props = {
    data: MetricsResponse;
};

const ChatMessagesBySenderChartCard = ({ data }: Props) => {
    const rows = (data.chat.messages_by_sender_type ?? []).map((row) => ({
        type: (row.sender_type || "UNKNOWN").toString(),
        total: row.total ?? 0,
    }));

    return (
        <Card className="rounded-3xl border-border/60 bg-card/70 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <CardHeader className="px-6 pb-0">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm font-semibold text-foreground">Chat messages by sender</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-background/60 text-muted-foreground">
                        <MessageCircle className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-6">
                <ChartContainer
                    className="mt-4 h-[260px] w-full"
                    config={{
                        total: { label: "Messages", color: "hsl(var(--primary))" },
                    }}
                >
                    <BarChart data={rows} margin={{ left: 4, right: 10, top: 8, bottom: 0 }}>
                        <defs>
                            <linearGradient id="chatTotal" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-total)" stopOpacity={0.95} />
                                <stop offset="100%" stopColor="var(--color-total)" stopOpacity={0.25} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="type" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} width={36} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="total" fill="url(#chatTotal)" radius={[10, 10, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default ChatMessagesBySenderChartCard;

