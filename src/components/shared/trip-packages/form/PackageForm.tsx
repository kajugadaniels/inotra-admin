"use client";

import { useMemo, useState } from "react";
import { ArrowBigLeft, ArrowBigRight, Loader2, UploadCloudIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import PackageFormActivities from "./PackageFormActivities";
import PackageFormBasics from "./PackageFormBasics";
import PackageFormMedia from "./PackageFormMedia";
import PackageFormPricingStatus from "./PackageFormPricingStatus";
import PackageFormSidebar from "./PackageFormSidebar";

export type ExistingPackageImage = {
    id?: string;
    image_url?: string | null;
    caption?: string | null;
    is_featured?: boolean | null;
};

export type PackageActivityState = {
    activity_name: string;
    time: string; // day number, 1..duration_days
};

export type PackageFormState = {
    title: string;
    description: string;
    duration_days: string;
    price_amount: string;
    price_currency: string;
    is_active: boolean;
    cover_file: File | null;
    remove_cover: boolean;
    images: File[];
    remove_image_ids: string[];
    activities: PackageActivityState[];
};

export const defaultPackageForm: PackageFormState = {
    title: "",
    description: "",
    duration_days: "",
    price_amount: "",
    price_currency: "RWF",
    is_active: true,
    cover_file: null,
    remove_cover: false,
    images: [],
    remove_image_ids: [],
    activities: [],
};

const steps = [
    { key: "basics", label: "Basics" },
    { key: "activities", label: "Activities" },
    { key: "media", label: "Images" },
    { key: "settings", label: "Pricing & status" },
];

type Props = {
    form: PackageFormState;
    onChange: (next: PackageFormState) => void;
    onSubmit: () => Promise<void>;
    isSubmitting: boolean;
    submitLabel?: string;
    existingCoverUrl?: string | null;
    existingImages?: ExistingPackageImage[];
};

const PackageForm = ({
    form,
    onChange,
    onSubmit,
    isSubmitting,
    submitLabel = "Save package",
    existingCoverUrl = null,
    existingImages = [],
}: Props) => {
    const [step, setStep] = useState(0);

    const durationDays = useMemo(() => {
        const n = Number.parseInt(form.duration_days, 10);
        return Number.isFinite(n) && n > 0 ? n : null;
    }, [form.duration_days]);

    const activitiesValid = useMemo(() => {
        if (form.activities.length === 0) return true;
        if (!durationDays) return false;
        for (const activity of form.activities) {
            if (!activity.activity_name.trim()) return false;
            const day = Number.parseInt(activity.time, 10);
            if (!Number.isFinite(day) || day < 1) return false;
            if (day > durationDays) return false;
        }
        return true;
    }, [durationDays, form.activities]);

    const canNext = useMemo(() => {
        if (step === 0) return form.title.trim().length > 0 && !!durationDays;
        if (step === 1) return activitiesValid;
        return true;
    }, [activitiesValid, durationDays, form.title, step]);

    return (
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <PackageFormSidebar steps={steps} activeStep={step} />

            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5">
                {step === 0 ? (
                    <PackageFormBasics form={form} onChange={onChange} disabled={isSubmitting} />
                ) : null}

                {step === 1 ? (
                    <PackageFormActivities form={form} onChange={onChange} disabled={isSubmitting} />
                ) : null}

                {step === 2 ? (
                    <PackageFormMedia
                        form={form}
                        onChange={onChange}
                        disabled={isSubmitting}
                        existingCoverUrl={existingCoverUrl}
                        existingImages={existingImages}
                    />
                ) : null}

                {step === 3 ? (
                    <PackageFormPricingStatus form={form} onChange={onChange} disabled={isSubmitting} />
                ) : null}

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full"
                        onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                        disabled={step === 0 || isSubmitting}
                    >
                        <ArrowBigLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>

                    {step < steps.length - 1 ? (
                        <Button
                            type="button"
                            className="h-11 rounded-full"
                            onClick={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))}
                            disabled={!canNext || isSubmitting}
                        >
                            Next
                            <ArrowBigRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            className="h-11 rounded-full"
                            onClick={onSubmit}
                            disabled={isSubmitting || !canNext}
                        >
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {submitLabel}
                            <UploadCloudIcon className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PackageForm;

