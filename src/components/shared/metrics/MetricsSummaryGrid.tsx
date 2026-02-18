"use client";

import type { MetricsResponse } from "@/api/metrics";
import UsersMetricsCard from "./cards/UsersMetricsCard";
import ListingsMetricsCard from "./cards/ListingsMetricsCard";
import EventsMetricsCard from "./cards/EventsMetricsCard";
import TripPackagesMetricsCard from "./cards/TripPackagesMetricsCard";
import EngagementMetricsCard from "./cards/EngagementMetricsCard";
import OperationsMetricsCard from "./cards/OperationsMetricsCard";

type Props = {
    data: MetricsResponse | null;
    isLoading: boolean;
};

const MetricsSummaryGrid = ({ data, isLoading }: Props) => {
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <UsersMetricsCard data={data} isLoading={isLoading} />
            <ListingsMetricsCard data={data} isLoading={isLoading} />
            <EventsMetricsCard data={data} isLoading={isLoading} />
            <TripPackagesMetricsCard data={data} isLoading={isLoading} />
            <EngagementMetricsCard data={data} isLoading={isLoading} />
            <OperationsMetricsCard data={data} isLoading={isLoading} />
        </div>
    );
};

export default MetricsSummaryGrid;

