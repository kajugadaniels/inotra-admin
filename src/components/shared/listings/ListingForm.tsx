import { useMemo, useState } from "react";

import type { PlaceCategory, PlaceImage } from "@/api/types";
import ListingBasicInfo from "./ListingBasicInfo";
import ListingContactInfo from "./ListingContactInfo";
import ListingFormSidebar from "./ListingFormSidebar";
import ListingImages from "./ListingImages";
import ListingLocationInfo from "./ListingLocationInfo";
import ListingOpeningHours from "./ListingOpeningHours";
import ListingServices from "./ListingServices";
import ListingStatus from "./ListingStatus";
import ListingStepNav from "./ListingStepNav";

export type ListingServiceState = {
    name: string;
    is_available: boolean;
};

export type DayKey =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

export type OpeningHoursState = Record<
    DayKey,
    {
        open: string;
        close: string;
        closed: boolean;
    }
>;

export type ListingFormState = {
    name: string;
    categoryId: string;
    description: string;
    address: string;
    city: string;
    country: string;
    latitude: string;
    longitude: string;
    phone: string;
    whatsapp: string;
    email: string;
    website: string;
    openingHours: OpeningHoursState;
    is_verified: boolean;
    is_active: boolean;
    images: File[];
    removeImageIds: string[];
    services: ListingServiceState[];
};

export const createDefaultOpeningHours = (): OpeningHoursState => ({
    monday: { open: "08:00", close: "18:00", closed: false },
    tuesday: { open: "08:00", close: "18:00", closed: false },
    wednesday: { open: "08:00", close: "18:00", closed: false },
    thursday: { open: "08:00", close: "18:00", closed: false },
    friday: { open: "08:00", close: "18:00", closed: false },
    saturday: { open: "09:00", close: "16:00", closed: false },
    sunday: { open: "09:00", close: "14:00", closed: true },
});

export const serializeOpeningHours = (state: OpeningHoursState) => {
    const payload: Record<string, unknown> = {};
    Object.entries(state).forEach(([day, value]) => {
        if (value.closed) {
            payload[day] = { closed: true };
            return;
        }
        payload[day] = { open: value.open, close: value.close };
    });
    return payload;
};

export const parseOpeningHours = (raw?: unknown): OpeningHoursState => {
    const defaultState = createDefaultOpeningHours();
    if (!raw || typeof raw !== "object") return defaultState;

    const result: OpeningHoursState = { ...defaultState };
    (Object.keys(defaultState) as DayKey[]).forEach((day) => {
        const entry = (raw as Record<string, any>)[day];
        if (!entry || typeof entry !== "object") return;
        const closed = Boolean(entry.closed);
        result[day] = {
            open: entry.open ?? defaultState[day].open,
            close: entry.close ?? defaultState[day].close,
            closed,
        };
    });
    return result;
};

type ListingFormProps = {
    form: ListingFormState;
    categories: PlaceCategory[];
    existingImages?: PlaceImage[];
    disabled?: boolean;
    onChange: (next: ListingFormState) => void;
    onImagesChange: (files: File[]) => void;
    onToggleRemoveImage?: (imageId: string) => void;
    onSubmit?: () => void;
};

const ListingForm = ({
    form,
    categories,
    existingImages = [],
    disabled = false,
    onChange,
    onImagesChange,
    onToggleRemoveImage,
    onSubmit,
}: ListingFormProps) => {
    const [stepIndex, setStepIndex] = useState(0);

    const steps = useMemo(
        () => [
            {
                key: "basic",
                label: "Basics",
                description: "Listing identity and description",
                content: (
                    <ListingBasicInfo
                        form={form}
                        categories={categories}
                        disabled={disabled}
                        onChange={onChange}
                    />
                ),
            },
            {
                key: "location",
                label: "Location",
                description: "Where the listing is located",
                content: (
                    <ListingLocationInfo
                        form={form}
                        disabled={disabled}
                        onChange={onChange}
                    />
                ),
            },
            {
                key: "contact",
                label: "Contact",
                description: "How guests can reach you",
                content: (
                    <ListingContactInfo
                        form={form}
                        disabled={disabled}
                        onChange={onChange}
                    />
                ),
            },
            {
                key: "services",
                label: "Services",
                description: "Amenities and features",
                content: (
                    <ListingServices
                        form={form}
                        disabled={disabled}
                        onChange={onChange}
                    />
                ),
            },
            {
                key: "hours",
                label: "Hours",
                description: "Weekly availability",
                content: (
                    <ListingOpeningHours
                        form={form}
                        disabled={disabled}
                        onChange={onChange}
                    />
                ),
            },
            {
                key: "media",
                label: "Media & Status",
                description: "Images and visibility",
                content: (
                    <div className="space-y-6">
                        <ListingImages
                            images={form.images}
                            existingImages={existingImages}
                            removeImageIds={form.removeImageIds}
                            disabled={disabled}
                            onImagesChange={onImagesChange}
                            onToggleRemoveImage={onToggleRemoveImage}
                        />
                        <ListingStatus
                            form={form}
                            disabled={disabled}
                            onChange={onChange}
                        />
                    </div>
                ),
            },
        ],
        [
            categories,
            disabled,
            existingImages,
            form,
            onChange,
            onImagesChange,
            onToggleRemoveImage,
        ]
    );

    const currentStep = steps[stepIndex];

    return (
        <div className="space-y-6">
            <div className="md:hidden">
                <ListingStepNav
                    steps={steps}
                    activeIndex={stepIndex}
                    onStepChange={(index) => setStepIndex(index)}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-[280px_1fr]">
                <ListingFormSidebar
                    steps={steps}
                    activeIndex={stepIndex}
                    onStepChange={(index) => setStepIndex(index)}
                />

                <div className="rounded-3xl border border-border/60 bg-background/60 p-5">
                    <div className="mb-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                            {currentStep.label}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {currentStep.description}
                        </p>
                    </div>

                    {currentStep.content}

                    <div className="sticky bottom-4 mt-10 flex flex-wrap items-center justify-between gap-3 rounded-full border border-border/60 bg-background/80 px-4 py-3 backdrop-blur">
                        <button
                            type="button"
                            onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
                            disabled={disabled || stepIndex === 0}
                            className="rounded-full border border-border/60 bg-background/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (stepIndex === steps.length - 1) {
                                    onSubmit?.();
                                    return;
                                }
                                setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
                            }}
                            disabled={disabled}
                            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-lg shadow-primary/20 transition disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {stepIndex === steps.length - 1 ? "Save changes" : "Next"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingForm;
