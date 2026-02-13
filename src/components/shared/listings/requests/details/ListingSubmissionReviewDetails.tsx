import Link from "next/link";
import { ExternalLink, ShieldAlert, ShieldCheck, UserRound } from "lucide-react";

import type { ListingSubmissionDetail } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

const ListingSubmissionReviewDetails = ({ submission, isLoading }: Props) => {
    const submitter =
        submission?.submitted_by_name ||
        submission?.submitted_by_email ||
        submission?.submitted_by_phone ||
        "--";
    const reviewer = submission?.reviewer_name || "--";

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                        Review status
                    </p>
                    <Badge variant={statusVariant(submission?.status)} className="rounded-full">
                        {submission?.status ?? "PENDING"}
                    </Badge>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground inline-flex items-center gap-2">
                            <UserRound className="h-4 w-4" />
                            Submitted by
                        </p>
                        <p className="mt-2 text-xs font-semibold text-foreground">{submitter}</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground inline-flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            Reviewed by
                        </p>
                        <p className="mt-2 text-xs font-semibold text-foreground">{reviewer}</p>
                    </div>
                </div>

                <div className="mt-4 rounded-2xl border border-border/60 bg-background/60 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Reviewer notes
                    </p>
                    <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap">
                        {submission?.reviewer_notes || (isLoading ? "Loading…" : "No reviewer notes provided.")}
                    </p>
                </div>

                {submission?.approved_place_id ? (
                    <div className="mt-4 rounded-2xl border border-border/60 bg-background/60 p-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Approved listing
                                </p>
                                <p className="mt-2 text-sm font-semibold text-foreground">
                                    {submission.approved_place_name ?? "View listing"}
                                </p>
                            </div>
                            <Button asChild variant="outline" className="rounded-full">
                                <Link href={`/listings/${submission.approved_place_id}`}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Open
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    <ShieldAlert className="h-4 w-4" />
                    Rejection history
                </div>

                <div className="mt-4 space-y-3">
                    {submission?.rejections?.length ? (
                        submission.rejections.map((rej) => (
                            <div
                                key={rej.id}
                                className="rounded-2xl border border-border/60 bg-background/60 p-4"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-semibold text-foreground">
                                        {rej.rejected_by_name || "Admin"}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {formatDateTime(rej.created_at)}
                                    </p>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                                    {rej.reason || "No reason provided."}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {isLoading ? "Loading…" : "No rejections recorded for this submission."}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListingSubmissionReviewDetails;

