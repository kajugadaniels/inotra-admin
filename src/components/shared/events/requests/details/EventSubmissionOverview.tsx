"use client";

import Image from "next/image";
import { CalendarDays, MapPin, Ticket } from "lucide-react";

import type { EventSubmissionDetail } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import RichTextRenderer from "@/components/shared/listings/details/RichTextRenderer";

const statusVariant = (status?: string | null) => {
    switch (status) {
        case "APPROVED":
            return "default" as const;
        case "REJECTED":
            return "destructive" as const;
        case "PENDING":
        default:
            return "secondary" as const;
    }
};

const formatDateTime = (value?: string | null) => {
    if (!value) return "--";
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return "--";
    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(dt);
};

type Props = {
    submission: EventSubmissionDetail | null;
    isLoading: boolean;
};

const EventSubmissionOverview = ({ submission, isLoading }: Props) => {
    return (
        <section className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            variant={statusVariant(submission?.status)}
                            className="rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em]"
                        >
                            {submission?.status ?? "PENDING"}
                        </Badge>
                        {submission?.venue_name ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-2 text-xs font-semibold text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {submission.venue_name}
                            </span>
                        ) : null}
                    </div>

                    <h2 className="mt-4 text-xl font-semibold text-foreground">
                        {submission?.title ?? (isLoading ? "Loading submission…" : "Event submission")}
                    </h2>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            Starts {formatDateTime(submission?.start_at)}
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <Ticket className="h-4 w-4" />
                            Tickets {submission?.tickets?.length ?? submission?.tickets_count ?? 0}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-border/60 bg-background/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                        Description
                    </p>
                    <div className="mt-3">
                        {submission?.description ? (
                            <RichTextRenderer html={submission.description} />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {isLoading ? "Loading…" : "No description provided."}
                            </p>
                        )}
                    </div>
                </div>

                <div className="rounded-3xl border border-border/60 bg-background/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                        Banner
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                        Preview of the submitted banner image.
                    </p>
                    <div className="mt-4 w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
                        {submission?.banner_url ? (
                            <div className="relative w-full aspect-video">
                                <Image
                                    src={submission.banner_url}
                                    alt={submission.title ?? "Event banner"}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 680px"
                                    priority
                                />
                            </div>
                        ) : (
                            <div className="flex w-full h-48 items-center justify-center text-xs text-muted-foreground">
                                {isLoading ? "Loading…" : "No banner uploaded."}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventSubmissionOverview;

