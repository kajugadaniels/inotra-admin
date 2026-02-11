"use client";

import { useMemo, useState } from "react";
import { ArrowBigLeft, ArrowBigRight, Loader2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import EventFormSidebar from "./EventFormSidebar";
import EventFormDetails from "./EventFormDetails";
import EventFormSchedule from "./EventFormSchedule";
import EventFormPricing from "./EventFormPricing";
import EventFormMedia from "./EventFormMedia";
import EventFormTickets from "./EventFormTickets";

export type EventTicketState = {
    category: "FREE" | "REGULAR" | "VIP" | "VVIP" | "TABLE";
    price: string;
    consumable: boolean;
    consumable_description: string;
};

export type EventFormState = {
    title: string;
    description: string;
    start_at: string;
    end_at: string;
    venue_name: string;
    address: string;
    city: string;
    country: string;
    latitude: string;
    longitude: string;
    tickets: EventTicketState[];
    is_active: boolean;
    is_verified: boolean;
    banner_url?: string | null;
    banner?: File | null;
    remove_banner?: boolean;
};

export const defaultEventForm: EventFormState = {
    title: "",
    description: "",
    start_at: "",
    end_at: "",
    venue_name: "",
    address: "",
    city: "",
    country: "Rwanda",
    latitude: "",
    longitude: "",
    tickets: [],
    is_active: true,
    is_verified: false,
    banner_url: null,
    banner: null,
    remove_banner: false,
};

const steps = [
    { key: "details", label: "Event details" },
    { key: "schedule", label: "Schedule & venue" },
    { key: "tickets", label: "Tickets" },
    { key: "pricing", label: "Visibility" },
    { key: "media", label: "Media" },
];

type Props = {
    form: EventFormState;
    setForm: (next: EventFormState) => void;
    onSubmit: () => Promise<void>;
    isSubmitting: boolean;
};

const EventForm = ({ form, setForm, onSubmit, isSubmitting }: Props) => {
    const [step, setStep] = useState(0);

    const canNext = useMemo(() => {
        if (step === 0) return form.title.trim().length > 0;
        if (step === 1) return true;
        if (step === 2) return true;
        return true;
    }, [form.title, step]);

    const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
    const back = () => setStep((s) => Math.max(0, s - 1));

    return (
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <EventFormSidebar steps={steps} activeStep={step} />

            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5">
                {step === 0 && <EventFormDetails form={form} setForm={setForm} />}
                {step === 1 && <EventFormSchedule form={form} setForm={setForm} />}
                {step === 2 && <EventFormTickets form={form} setForm={setForm} />}
                {step === 3 && <EventFormPricing form={form} setForm={setForm} />}
                {step === 4 && <EventFormMedia form={form} setForm={setForm} />}

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full text-xs h-11 uppercase font-bold"
                        onClick={back}
                        disabled={step === 0 || isSubmitting}
                    >
                        <ArrowBigLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    {step < steps.length - 1 ? (
                        <Button
                            type="button"
                            className="rounded-full text-xs h-11 uppercase font-bold"
                            onClick={next}
                            disabled={!canNext || isSubmitting}
                        >
                            Next
                            <ArrowBigRight className="mr-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            className="rounded-full text-xs h-11 uppercase font-bold"
                            onClick={onSubmit}
                            disabled={isSubmitting || !form.title.trim()}
                        >
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                            Save event
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventForm;
