"use client";

import { Users } from "lucide-react";

import type { MetricsResponse } from "@/api/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    data: MetricsResponse | null;
    isLoading: boolean;
};

const UsersMetricsCard = ({ data, isLoading }: Props) => {
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
                    <div className="grid gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    const total = data?.users?.total ?? 0;
    const byRole = data?.users?.by_role ?? [];
    const roleRow = (role: string) => byRole.find((r) => r.role === role) ?? null;

    const admin = roleRow("ADMIN");
    const user = roleRow("USER");
    const rep = roleRow("CUSTOMER_REPRESENTATIVE");

    return (
        <Card className="rounded-3xl border-border/60 bg-card/70 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <CardHeader className="px-6 pb-0">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm font-semibold text-foreground">Users</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-background/60 text-muted-foreground">
                        <Users className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 px-6">
                <div>
                    <p className="text-3xl font-semibold text-foreground">{total.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Total users (within selected date range)</p>
                </div>

                <div className="grid gap-2 rounded-2xl border border-border/60 bg-background/60 p-4 text-xs">
                    <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-foreground">Admins</span>
                        <span className="text-muted-foreground">
                            {(admin?.active ?? 0).toLocaleString()} active · {(admin?.inactive ?? 0).toLocaleString()} inactive
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-foreground">Customers</span>
                        <span className="text-muted-foreground">
                            {(user?.active ?? 0).toLocaleString()} active · {(user?.inactive ?? 0).toLocaleString()} inactive
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-foreground">Representatives</span>
                        <span className="text-muted-foreground">
                            {(rep?.active ?? 0).toLocaleString()} active · {(rep?.inactive ?? 0).toLocaleString()} inactive
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default UsersMetricsCard;

