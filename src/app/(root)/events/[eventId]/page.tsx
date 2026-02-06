"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, PenBoxIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { getEvent, type EventDetail } from "@/api/events";
import { getApiBaseUrl } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    EventDetailsSidebar,
    EventOverview,
    EventScheduleVenue,
    EventPricingStatus,
    EventMedia,
} from "@/components/shared/events/details";

const formatDate = (value?: string | null) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
};

const EventDetailsPage = () => {
    const params = useParams();
    const eventId = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId;

    const [event, setEvent] = useState<EventDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? "";
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        if (!eventId) return;
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to access event details.",
            });
            return;
        }

        setIsLoading(true);
        getEvent({ apiBaseUrl, accessToken: tokens.access, eventId })
            .then((result) => {
                if (!result.ok || !result.body) {
                    toast.error("Unable to load event details", {
                        description: extractErrorDetail(result.body) || "Please try again.",
                    });
                    return;
                }
                setEvent(result.body);
            })
            .catch((error: Error) => {
                toast.error("Unable to load event details", {
                    description: error.message ?? "Check API connectivity and try again.",
                });
            })
            .finally(() => setIsLoading(false));
    }, [apiBaseUrl, eventId]);

    const tabs = [
        { key: "overview", label: "Overview", description: "Status & summary" },
        { key: "schedule", label: "Schedule", description: "Venue & map" },
        { key: "pricing", label: "Pricing", description: "Price & visibility" },
        { key: "media", label: "Media", description: "Banner image" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Link
                        href="/events"
                        className="inline-flex items-center gap-2 text-xs font-bold capitalize text-muted-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to events
                    </Link>

                    <h1 className="mt-3 text-3xl font-semibold text-foreground">
                        {event?.title ?? (isLoading ? "Loading event..." : "Event details")}
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {event?.venue_name ?? "Venue"} · Starts {formatDate(event?.start_at)}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {event?.id ? (
                        <Button asChild variant="outline" className="rounded-full h-11 text-xs">
                            <Link href={`/events/${event.id}/edit`}>
                                <PenBoxIcon className="mr-2 h-4 w-4" />
                                Edit event
                            </Link>
                        </Button>
                    ) : null}
                </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <Tabs defaultValue="overview" orientation="vertical" className="gap-6 lg:flex-row">
                    <EventDetailsSidebar tabs={tabs} />

                    <div className="space-y-6">
                        <TabsList
                            variant="line"
                            className="flex w-full flex-wrap gap-2 bg-transparent p-0 lg:hidden"
                        >
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.key}
                                    value={tab.key}
                                    className="rounded-full border border-border/60 bg-background/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="overview">
                            <EventOverview event={event} isLoading={isLoading} />
                        </TabsContent>

                        <TabsContent value="schedule">
                            <EventScheduleVenue
                                event={event}
                                isLoading={isLoading}
                                mapsApiKey={mapsApiKey}
                            />
                        </TabsContent>

                        <TabsContent value="pricing">
                            <EventPricingStatus event={event} isLoading={isLoading} />
                        </TabsContent>

                        <TabsContent value="media">
                            <EventMedia event={event} isLoading={isLoading} />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default EventDetailsPage;
