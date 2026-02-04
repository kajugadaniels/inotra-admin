"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Pencil, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { getPackage, type PackageDetail } from "@/api/packages";
import { getApiBaseUrl } from "@/config/api";
import { Button } from "@/components/ui/button";

const formatMoney = (amount?: string | number | null, currency?: string | null) => {
    if (amount === null || amount === undefined || amount === "") return null;
    const number = typeof amount === "number" ? amount : Number.parseFloat(String(amount));
    if (!Number.isFinite(number)) return null;
    return `${currency?.toUpperCase() || "USD"} ${number.toFixed(2)}`;
};

const TripPackageDetailsPage = () => {
    const router = useRouter();
    const params = useParams();
    const packageId = params?.packageId as string | undefined;
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const [data, setData] = useState<PackageDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access || !packageId) {
            toast.error("Session missing", { description: "Sign in again to view package details." });
            router.replace("/trip-packages");
            return;
        }
        setLoading(true);
        getPackage({ apiBaseUrl, accessToken: tokens.access, packageId })
            .then((res) => {
                if (!res.ok || !res.body) {
                    toast.error("Unable to load package", { description: extractErrorDetail(res.body) });
                    router.replace("/trip-packages");
                    return;
                }
                setData(res.body as PackageDetail);
            })
            .catch((error: Error) => {
                toast.error("Unable to load package", {
                    description: error.message ?? "Check API connectivity.",
                });
                router.replace("/trip-packages");
            })
            .finally(() => setLoading(false));
    }, [apiBaseUrl, packageId, router]);

    if (loading || !data) {
        return (
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 text-sm text-muted-foreground shadow-2xl shadow-black/5">
                Loading package...
            </div>
        );
    }

    const title = data.title?.trim() || "Untitled package";
    const isActive = data.is_active ?? true;
    const priceLabel = formatMoney(data.price_amount ?? null, data.price_currency ?? null);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Trip package
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
                            {title}
                        </h1>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                                {isActive ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                ) : (
                                    <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                )}
                                {isActive ? "Active" : "Inactive"}
                            </span>
                            {typeof data.duration_days === "number" ? (
                                <span className="inline-flex items-center rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                                    {data.duration_days} day{data.duration_days === 1 ? "" : "s"}
                                </span>
                            ) : null}
                            {typeof data.activities_count === "number" ? (
                                <span className="inline-flex items-center rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                                    {data.activities_count} activities
                                </span>
                            ) : null}
                            {priceLabel ? (
                                <span className="inline-flex items-center rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                                    {priceLabel}
                                </span>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" className="h-11 rounded-full">
                            <Link href="/trip-packages">
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        {data.id ? (
                            <Button asChild className="h-11 rounded-full">
                                <Link href={`/trip-packages/${data.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5">
                    <h2 className="text-sm font-semibold text-foreground">Cover</h2>
                    <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-background/70">
                        {data.cover_url ? (
                            <Image
                                src={data.cover_url}
                                alt={`${title} cover`}
                                width={1600}
                                height={900}
                                className="h-56 w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-56 items-center justify-center text-xs text-muted-foreground">
                                No cover image
                            </div>
                        )}
                    </div>

                    <h2 className="mt-6 text-sm font-semibold text-foreground">Description</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {data.description?.trim() || "No description provided."}
                    </p>
                </div>

                <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5">
                    <h2 className="text-sm font-semibold text-foreground">Activities</h2>
                    <p className="mt-2 text-xs text-muted-foreground">
                        Ordered by day number.
                    </p>

                    {data.activities && data.activities.length > 0 ? (
                        <div className="mt-4 space-y-3">
                            {[...data.activities]
                                .sort((a, b) => (a.time ?? 0) - (b.time ?? 0))
                                .map((activity) => (
                                    <div
                                        key={activity.id ?? `${activity.activity_name}-${activity.time}`}
                                        className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-background/60 px-4 py-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-foreground">
                                                {activity.activity_name ?? "Untitled activity"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Day {activity.time ?? "--"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="mt-4 rounded-2xl border border-border/60 bg-background/60 px-4 py-8 text-center text-xs text-muted-foreground">
                            No activities added.
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold text-foreground">Gallery</h2>
                    <p className="text-xs text-muted-foreground">
                        {data.images?.length ?? 0} image(s)
                    </p>
                </div>
                {data.images && data.images.length > 0 ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {data.images.map((img) => (
                            <div
                                key={img.id ?? img.image_url ?? "img"}
                                className="overflow-hidden rounded-2xl border border-border/60 bg-background/70"
                            >
                                {img.image_url ? (
                                    <Image
                                        src={img.image_url}
                                        alt={img.caption || "Package image"}
                                        width={480}
                                        height={320}
                                        className="h-40 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-40 items-center justify-center text-xs text-muted-foreground">
                                        No image
                                    </div>
                                )}
                                <div className="px-3 py-2">
                                    <p className="text-xs font-semibold text-foreground">
                                        {img.is_featured ? "Featured" : "Gallery"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {img.caption || "No caption"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-4 rounded-2xl border border-border/60 bg-background/60 px-4 py-8 text-center text-xs text-muted-foreground">
                        No gallery images.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TripPackageDetailsPage;

