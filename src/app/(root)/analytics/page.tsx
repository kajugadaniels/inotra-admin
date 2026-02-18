"use client";

import React, { useMemo } from "react";

import { AdminAnalyticsMetrics } from "@/components/shared/metrics";
import { getApiBaseUrl } from "@/config/api";

const Analytics = () => {
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Analytics</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Visualize key platform metrics with responsive, gradient charts.
                </p>
            </div>

            <AdminAnalyticsMetrics apiBaseUrl={apiBaseUrl} />
        </div>
    );
};

export default Analytics;
