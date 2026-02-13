"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { getListingSubmission } from "@/api/listings/submissions";
import type { ListingSubmissionDetail } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingDetailsSidebar } from "@/components/shared/listings/details";
import {
    ListingSubmissionContactDetails,
    ListingSubmissionLocationDetails,
    ListingSubmissionOperationsDetails,
    ListingSubmissionOverview,
    ListingSubmissionReviewDetails,
} from "@/components/shared/listings/requests/details";

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

const ListingSubmissionDetailsPage = () => {
    const params = useParams();
    const router = useRouter();
    const submissionId = Array.isArray(params.submissionId)
        ? params.submissionId[0]
        : (params.submissionId as string | undefined);

    const [submission, setSubmission] = useState<ListingSubmissionDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? "";
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        if (!submissionId) return;
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to access submission details.",
            });
            router.replace("/listings/requests");
            return;
        }

        setIsLoading(true);
        getListingSubmission({ apiBaseUrl, accessToken: tokens.access, submissionId })
            .then((result) => {
                if (!result.ok || !result.body) {
                    toast.error("Unable to load submission details", {
                        description: extractErrorDetail(result.body) || "Please try again.",
                    });
                    router.replace("/listings/requests");
                    return;
                }
                setSubmission(result.body);
            })
            .catch((error: Error) => {
                toast.error("Unable to load submission details", {
                    description: error.message ?? "Check API connectivity and try again.",
                });
                router.replace("/listings/requests");
            })
            .finally(() => setIsLoading(false));
    }, [apiBaseUrl, router, submissionId]);

    const tabs = [
        { key: "overview", label: "Overview", description: "Submission summary" },
        { key: "location", label: "Location", description: "Address & map" },
        { key: "contact", label: "Contact", description: "Submitter contact info" },
        { key: "operations", label: "Operations", description: "Hours & services" },
        { key: "review", label: "Review", description: "Notes & history" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="mt-3 text-3xl font-semibold text-foreground">
                        {submission?.name ?? (isLoading ? "Loading submission..." : "Listing submission")}
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {submission?.category_name ?? "Uncategorized"} · Submitted{" "}
                        {formatDate(submission?.created_at)}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" className="rounded-full h-11 text-xs">
                        <Link href="/listings/requests">
                            <ArrowLeft className="h-4 w-4" />
                            Back to requests
                        </Link>
                    </Button>
                    {submission?.approved_place_id ? (
                        <Button asChild variant="outline" className="rounded-full h-11 text-xs">
                            <Link href={`/listings/${submission.approved_place_id}`}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open listing
                            </Link>
                        </Button>
                    ) : null}
                </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <Tabs defaultValue="overview" orientation="vertical" className="gap-6 lg:flex-row">
                    <ListingDetailsSidebar tabs={tabs} title="Submission details" />

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
                            <ListingSubmissionOverview submission={submission} isLoading={isLoading} />
                        </TabsContent>

                        <TabsContent value="location">
                            <ListingSubmissionLocationDetails
                                submission={submission}
                                isLoading={isLoading}
                                mapsApiKey={mapsApiKey}
                            />
                        </TabsContent>

                        <TabsContent value="contact">
                            <ListingSubmissionContactDetails submission={submission} isLoading={isLoading} />
                        </TabsContent>

                        <TabsContent value="operations">
                            <ListingSubmissionOperationsDetails submission={submission} isLoading={isLoading} />
                        </TabsContent>

                        <TabsContent value="review">
                            <ListingSubmissionReviewDetails submission={submission} isLoading={isLoading} />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default ListingSubmissionDetailsPage;

