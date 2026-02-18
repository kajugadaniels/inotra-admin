"use client";

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { Users } from "lucide-react";

import type { MetricsResponse } from "@/api/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type Props = {
    data: MetricsResponse;
};

const UsersByRoleChartCard = ({ data }: Props) => {
    const rows = (data.users.by_role ?? []).map((row) => ({
        role:
            row.role === "ADMIN"
                ? "Admins"
                : row.role === "CUSTOMER_REPRESENTATIVE"
                    ? "Representatives"
                    : "Customers",
        active: row.active ?? 0,
        inactive: row.inactive ?? 0,
    }));

    return (
        <Card className="rounded-3xl border-border/60 bg-card/70 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <CardHeader className="px-6 pb-0">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm font-semibold text-foreground">Users by role</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-background/60 text-muted-foreground">
                        <Users className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-6">
                <ChartContainer
                    className="mt-4 h-[260px] w-full"
                    config={{
                        active: { label: "Active", color: "hsl(var(--primary))" },
                        inactive: { label: "Inactive", color: "hsl(var(--muted-foreground))" },
                    }}
                >
                    <BarChart data={rows} margin={{ left: 4, right: 10, top: 8, bottom: 0 }}>
                        <defs>
                            <linearGradient id="usersActive" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-active)" stopOpacity={0.95} />
                                <stop offset="100%" stopColor="var(--color-active)" stopOpacity={0.35} />
                            </linearGradient>
                            <linearGradient id="usersInactive" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-inactive)" stopOpacity={0.55} />
                                <stop offset="100%" stopColor="var(--color-inactive)" stopOpacity={0.2} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="role" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} width={36} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="active" fill="url(#usersActive)" radius={[10, 10, 0, 0]} />
                        <Bar dataKey="inactive" fill="url(#usersInactive)" radius={[10, 10, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default UsersByRoleChartCard;

