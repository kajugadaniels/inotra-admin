"use client";

import Image from "next/image";
import { CalendarDays, MapPin, Tag } from "lucide-react";
import { useMemo } from "react";

import type { ListingSubmissionDetail } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import RichTextRenderer from "@/components/shared/listings/details/RichTextRenderer";

const formatDateTime = (value?: string | null) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

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

type Props = {
    submission: ListingSubmissionDetail | null;
    isLoading: boolean;
};

const ListingSubmissionOverview = ({ submission, isLoading }: Props) => {
    const images = useMemo(() => submission?.images ?? [], [submission?.images]);
    const heroImage = images[0]?.image_url ?? null;

    return (
        <section className="space-y-4">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                variant={statusVariant(submission?.status)}
                                className="rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em]"
                            >
                                {submission?.status ?? "PENDING"}
                            </Badge>
                            {submission?.category_name ? (
                                <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-2 text-xs font-semibold text-muted-foreground">
                                    <Tag className="h-4 w-4" />
                                    {submission.category_name}
                                </span>
                            ) : null}
                        </div>

                        <h2 className="mt-4 text-xl font-semibold text-foreground">
                            {submission?.name ?? (isLoading ? "Loading submission…" : "Listing submission")}
                        </h2>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {(submission?.city || "--") + ", " + (submission?.country || "--")}
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" />
                                Submitted {formatDateTime(submission?.created_at)}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Images
                            </p>
                            <p className="mt-1 text-sm font-semibold text-foreground">
                                {submission?.images?.length ?? submission?.images_count ?? 0}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Services
                            </p>
                            <p className="mt-1 text-sm font-semibold text-foreground">
                                {submission?.services?.length ?? submission?.services_count ?? 0}
                            </p>
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
                            Media
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                            Preview of uploaded images for this submission.
                        </p>

                        <div className="mt-4">
                            {heroImage ? (
                                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/60">
                                    <Image
                                        src={heroImage}
                                        alt={submission?.name ?? "Submission image"}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 640px"
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-border/60 bg-muted/40 text-sm text-muted-foreground">
                                    {isLoading ? "Loading images…" : "No images uploaded."}
                                </div>
                            )}

                            {images.length > 1 ? (
                                <div className="mt-3 grid grid-cols-4 gap-2">
                                    {images.slice(0, 8).map((img) => (
                                        <div
                                            key={img.id}
                                            className="relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-muted/60"
                                        >
                                            {img.image_url ? (
                                                <Image
                                                    src={img.image_url}
                                                    alt={img.caption ?? "Submission image"}
                                                    fill
                                                    sizes="120px"
                                                    className="object-cover"
                                                />
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ListingSubmissionOverview;

