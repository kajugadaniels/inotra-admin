"use client";

import React, { useMemo } from "react";

import { AdminDashboardMetrics } from "@/components/shared/metrics";
import { getApiBaseUrl } from "@/config/api";

const AdminDashboard = () => {
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Dashboard</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    A concise overview of platform activity. Use the date range to filter totals.
                </p>
            </div>

            <AdminDashboardMetrics apiBaseUrl={apiBaseUrl} />
        </div>
    );
};

export default AdminDashboard;
