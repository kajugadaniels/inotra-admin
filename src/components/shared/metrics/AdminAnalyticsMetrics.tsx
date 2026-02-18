"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { getMetrics } from "@/api/metrics";
import type { MetricsResponse } from "@/api/metrics";

import MetricsDateRangeBar from "./MetricsDateRangeBar";
import MetricsChartsGrid from "./MetricsChartsGrid";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
    apiBaseUrl: string;
};

const AdminAnalyticsMetrics = ({ apiBaseUrl }: Props) => {
    const [data, setData] = useState<MetricsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [timezoneLabel, setTimezoneLabel] = useState<string | null>(null);

    const load = useCallback(
        async (opts?: { start?: string | null; end?: string | null }) => {
            const tokens = authStorage.getTokens();
            if (!tokens?.access) {
                toast.error("Session missing", { description: "Sign in again to view analytics." });
                return;
            }

            setIsLoading(true);
            try {
                const res = await getMetrics({
                    apiBaseUrl,
                    accessToken: tokens.access,
                    startDate: opts?.start ?? null,
                    endDate: opts?.end ?? null,
                });
                if (!res.ok || !res.body) {
                    toast.error("Unable to load analytics", { description: extractErrorDetail(res.body) });
                    return;
                }
                setData(res.body);
                setStartDate(res.body.range?.start_date ?? "");
                setEndDate(res.body.range?.end_date ?? "");
                setTimezoneLabel(res.body.range?.timezone ?? null);
            } catch (error) {
                toast.error("Unable to load analytics", {
                    description: error instanceof Error ? error.message : "Check API connectivity.",
                });
            } finally {
                setIsLoading(false);
            }
        },
        [apiBaseUrl]
    );

    useEffect(() => {
        void load();
    }, [load]);

    return (
        <div className="space-y-6">
            <MetricsDateRangeBar
                startDate={startDate}
                endDate={endDate}
                timezoneLabel={timezoneLabel}
                isLoading={isLoading}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onApply={() => void load({ start: startDate || null, end: endDate || null })}
                onReset={() => void load({ start: null, end: null })}
            />

            {isLoading && !data ? (
                <Card className="rounded-3xl border-border/60 bg-card/70 shadow-2xl shadow-black/5 backdrop-blur-xl">
                    <CardContent className="px-6 py-10 text-center text-sm text-muted-foreground">
                        Loading analytics…
                    </CardContent>
                </Card>
            ) : data ? (
                <MetricsChartsGrid data={data} />
            ) : (
                <Card className="rounded-3xl border-border/60 bg-card/70 shadow-2xl shadow-black/5 backdrop-blur-xl">
                    <CardContent className="px-6 py-10 text-center text-sm text-muted-foreground">
                        No analytics data available for the selected date range.
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AdminAnalyticsMetrics;

