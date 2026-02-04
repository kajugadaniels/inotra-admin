"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { createPackage } from "@/api/packages";
import { getApiBaseUrl } from "@/config/api";
import PackageForm, { defaultPackageForm, type PackageFormState } from "@/components/trip-packages/form/PackageForm";
import { Button } from "@/components/ui/button";

const NewPackagePage = () => {
    const router = useRouter();
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
    const [form, setForm] = useState<PackageFormState>({ ...defaultPackageForm });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", { description: "Sign in again to create packages." });
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
            const res = await createPackage({
                apiBaseUrl,
                accessToken: tokens.access,
                data: {
                    title,
                    description: form.description.trim() || undefined,
                    duration_days: durationDays,
                    price_amount: form.price_amount.trim() ? form.price_amount.trim() : undefined,
                    price_currency: form.price_currency.trim() ? form.price_currency.trim() : undefined,
                    is_active: form.is_active,
                    cover_url: form.cover_file,
                    images: form.images,
                    activities: activities.length ? activities : undefined,
                },
            });

            const payload = res.body as { package?: { id?: string } } | null;
            if (!res.ok || !payload?.package) {
                toast.error("Creation failed", { description: extractErrorDetail(res.body) });
                return;
            }

            toast.success("Package created");
            router.replace("/trip-packages");
        } catch (error) {
            toast.error("Creation failed", {
                description: error instanceof Error ? error.message : "Check API connectivity.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Create package</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Use the wizard to build a trip package with images and activities.
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
                submitLabel="Create package"
            />
        </div>
    );
};

export default NewPackagePage;

