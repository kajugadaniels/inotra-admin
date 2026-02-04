"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { getPackage, updatePackage, type PackageDetail } from "@/api/packages";
import { getApiBaseUrl } from "@/config/api";
import PackageForm, {
    defaultPackageForm,
    type ExistingPackageImage,
    type PackageFormState,
} from "@/components/shared/trip-packages/form/PackageForm";
import { Button } from "@/components/ui/button";

const EditPackagePage = () => {
    const router = useRouter();
    const params = useParams();
    const packageId = params?.packageId as string | undefined;
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const [form, setForm] = useState<PackageFormState>({ ...defaultPackageForm });
    const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
    const [existingImages, setExistingImages] = useState<ExistingPackageImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access || !packageId) {
            toast.error("Session missing", { description: "Sign in again to edit packages." });
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
                const data = res.body as PackageDetail;
                setExistingCoverUrl(data.cover_url ?? null);
                setExistingImages((data.images as ExistingPackageImage[] | undefined) ?? []);

                setForm({
                    title: data.title ?? "",
                    description: data.description ?? "",
                    duration_days: typeof data.duration_days === "number" ? String(data.duration_days) : "",
                    price_amount:
                        data.price_amount !== undefined && data.price_amount !== null
                            ? String(data.price_amount)
                            : "",
                    price_currency: data.price_currency ?? defaultPackageForm.price_currency,
                    is_active: data.is_active ?? true,
                    cover_file: null,
                    remove_cover: false,
                    images: [],
                    remove_image_ids: [],
                    activities:
                        data.activities?.map((a) => ({
                            activity_name: a.activity_name ?? "",
                            time: a.time !== null && a.time !== undefined ? String(a.time) : "",
                        })) ?? [],
                });
            })
            .catch((error: Error) => {
                toast.error("Unable to load package", {
                    description: error.message ?? "Check API connectivity.",
                });
                router.replace("/trip-packages");
            })
            .finally(() => setLoading(false));
    }, [apiBaseUrl, packageId, router]);

    const handleSubmit = async () => {
        if (!packageId) return;
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", { description: "Sign in again to update packages." });
            return;
        }

        const title = form.title.trim();
        const durationDays = Number.parseInt(form.duration_days, 10);
        if (!title || !Number.isFinite(durationDays) || durationDays < 1) {
            toast.error("Missing required fields", { description: "Title and duration days are required." });
            return;
        }

        const activities = form.activities
            .filter((a) => a.activity_name.trim() || a.time.trim())
            .map((a) => ({
                activity_name: a.activity_name.trim(),
                time: Number.parseInt(a.time, 10),
            }));

        for (const activity of activities) {
            if (!activity.activity_name) {
                toast.error("Invalid activities", { description: "Each activity needs a name." });
                return;
            }
            if (!Number.isFinite(activity.time) || activity.time < 1 || activity.time > durationDays) {
                toast.error("Invalid activities", {
                    description: `Activity day number must be within 1..${durationDays}.`,
                });
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const res = await updatePackage({
                apiBaseUrl,
                accessToken: tokens.access,
                packageId,
                data: {
                    title,
                    description: form.description.trim(),
                    duration_days: durationDays,
                    price_amount: form.price_amount.trim() ? form.price_amount.trim() : null,
                    price_currency: form.price_currency.trim() ? form.price_currency.trim() : null,
                    is_active: form.is_active,
                    cover_url: form.cover_file,
                    remove_cover_url: form.remove_cover,
                    images: form.images,
                    remove_image_ids: form.remove_image_ids,
                    activities,
                },
            });

            const payload = res.body as { package?: { id?: string } } | null;
            if (!res.ok || !payload?.package) {
                toast.error("Update failed", { description: extractErrorDetail(res.body) });
                return;
            }

            toast.success("Package updated");
            router.replace("/trip-packages");
        } catch (error) {
            toast.error("Update failed", {
                description: error instanceof Error ? error.message : "Check API connectivity.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 text-sm text-muted-foreground shadow-2xl shadow-black/5">
                Loading package...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Edit package</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Update the package itinerary, images, and status.
                        </p>
                    </div>

                    <Button asChild variant="outline" className="h-11 rounded-full">
                        <Link href="/trip-packages">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                </div>
            </div>

            <PackageForm
                form={form}
                onChange={setForm}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitLabel="Save changes"
                existingCoverUrl={existingCoverUrl}
                existingImages={existingImages}
            />
        </div>
    );
};

export default EditPackagePage;

