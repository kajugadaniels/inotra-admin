import { requestJson } from "../http";
import type { MetricsResponse } from "./types";

export type GetMetricsArgs = {
    apiBaseUrl: string;
    accessToken: string;
    startDate?: string | null;
    endDate?: string | null;
};

export function getMetrics({ apiBaseUrl, accessToken, startDate, endDate }: GetMetricsArgs) {
    const params = new URLSearchParams();
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);

    const path = `/metrics/${params.toString() ? `?${params.toString()}` : ""}`;

    return requestJson<MetricsResponse>({
        apiBaseUrl,
        path,
        method: "GET",
        accessToken,
    });
}

