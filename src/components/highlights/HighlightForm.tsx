"use client";

import { useMemo, useState } from "react";

import { authStorage } from "@/api/auth";
import { listEvents } from "@/api/events";
import { listPlaces } from "@/api/places";
import { getApiBaseUrl } from "@/config/api";
import HighlightFormSidebar from "./HighlightFormSidebar";
import HighlightFormContent from "./HighlightFormContent";
import HighlightFormLinks from "./HighlightFormLinks";
import HighlightFormMedia from "./HighlightFormMedia";

export type HighlightFormState = {
    caption: string;
    place_id: string;
    event_id: string;
    images: File[];
    videos: File[];
    remove_media_ids: string[];
};

export const defaultHighlightForm: HighlightFormState = {
    caption: "",
    place_id: "",
    event_id: "",
    images: [],
    videos: [],
    remove_media_ids: [],
};

const steps = [
    { key: "content", label: "Content" },
    { key: "links", label: "Place / event" },
    { key: "media", label: "Media" },
];

type Props = {
    form: HighlightFormState;
    setForm: (next: HighlightFormState) => void;
    isSubmitting: boolean;
    onSubmit: () => Promise<void>;
    existingMedia?: {
        id?: string;
        caption?: string | null;
        media_type?: string;
        image_url?: string | null;
        video_url?: string | null;
    }[];
};

const HighlightForm = ({ form, setForm, isSubmitting, onSubmit, existingMedia = [] }: Props) => {
    const [step, setStep] = useState(0);
    const [mediaMarked, setMediaMarked] = useState<string[]>([]);
    const [placeLabel, setPlaceLabel] = useState<string | null>(null);
    const [eventLabel, setEventLabel] = useState<string | null>(null);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
    const tokens = authStorage.getTokens();

    const goNext = () => setStep((s) => Math.min(steps.length - 1, s + 1));
    const goBack = () => setStep((s) => Math.max(0, s - 1));

    const canNext =
        step === 2 ? form.images.length + form.videos.length > 0 || existingMedia.length > 0 : true;

    const markRemove = (id?: string) => {
        if (!id) return;
        setMediaMarked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
        setForm((prev) => ({
            ...prev,
            remove_media_ids: prev.remove_media_ids.includes(id)
                ? prev.remove_media_ids.filter((x) => x !== id)
                : [...prev.remove_media_ids, id],
        }));
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <HighlightFormSidebar steps={steps} activeStep={step} />

            <div className="space-y-6 rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5">
                {step === 0 && (
                    <HighlightFormContent form={form} setForm={setForm} />
                )}

                {step === 1 && (
                    <HighlightFormLinks
                        form={form}
                        setForm={setForm}
                        apiBaseUrl={apiBaseUrl}
                        accessToken={tokens?.access}
                        listPlaces={listPlaces}
                        listEvents={listEvents}
                        placeLabel={placeLabel}
                        setPlaceLabel={setPlaceLabel}
                        eventLabel={eventLabel}
                        setEventLabel={setEventLabel}
                    />
                )}

                {step === 2 && (
                    <HighlightFormMedia
                        form={form}
                        setForm={setForm}
                        existingMedia={existingMedia}
                        mediaMarked={mediaMarked}
                        toggleRemove={markRemove}
                    />
                )}

                <div className="flex justify-end">
                    <div className="flex w-full flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="button"
                            className="rounded-full border border-border/60 px-4 py-2 text-sm font-semibold text-muted-foreground hover:border-primary/60 hover:text-foreground disabled:opacity-60"
                            onClick={goBack}
                            disabled={step === 0 || isSubmitting}
                        >
                            Back
                        </button>
                        {step < steps.length - 1 ? (
                            <button
                                type="button"
                                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                                onClick={goNext}
                                disabled={!canNext || isSubmitting}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                                onClick={onSubmit}
                                disabled={isSubmitting || !canNext}
                            >
                                {isSubmitting ? "Saving..." : "Save highlight"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighlightForm;
