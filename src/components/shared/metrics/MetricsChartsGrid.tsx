"use client";

import type { MetricsResponse } from "@/api/metrics";
import UsersByRoleChartCard from "./charts/UsersByRoleChartCard";
import ListingsByCategoryChartCard from "./charts/ListingsByCategoryChartCard";
import EventsStatusChartCard from "./charts/EventsStatusChartCard";
import ChatMessagesBySenderChartCard from "./charts/ChatMessagesBySenderChartCard";
import BookingsByStatusChartCard from "./charts/BookingsByStatusChartCard";

type Props = {
    data: MetricsResponse;
};

const MetricsChartsGrid = ({ data }: Props) => {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <UsersByRoleChartCard data={data} />
            <EventsStatusChartCard data={data} />
            <ListingsByCategoryChartCard data={data} />
            <ChatMessagesBySenderChartCard data={data} />
            <BookingsByStatusChartCard data={data} />
        </div>
    );
};

export default MetricsChartsGrid;

