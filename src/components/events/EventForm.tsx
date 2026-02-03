"use client";

import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import EventFormSidebar from "./EventFormSidebar";

export type EventFormState = {
    title: string;
    description: string;
    start_at: string;
    end_at: string;
    venue_name: string;
    address: string;
    city: string;
    country: string;
    price: string;
    discount_price: string;
    is_active: boolean;
    is_verified: boolean;
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
    price: "",
    discount_price: "",
    is_active: true,
    is_verified: false,
    banner: null,
    remove_banner: false,
};

const steps = [
    { key: "details", label: "Event details" },
    { key: "schedule", label: "Schedule & venue" },
    { key: "pricing", label: "Pricing & status" },
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

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setForm({ ...form, banner: file, remove_banner: false });
    };

    const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
    const back = () => setStep((s) => Math.max(0, s - 1));

    return (
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <EventFormSidebar steps={steps} activeStep={step} />

            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5">
                {step === 0 && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Title (required)
                            </label>
                            <Input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Summer Music Festival"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Description (optional)
                            </label>
                            <Textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Describe the event experience..."
                                className="min-h-[140px]"
                            />
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Start at (optional)
                                </label>
                                <Input
                                    type="datetime-local"
                                    value={form.start_at}
                                    onChange={(e) => setForm({ ...form, start_at: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    End at (optional)
                                </label>
                                <Input
                                    type="datetime-local"
                                    value={form.end_at}
                                    onChange={(e) => setForm({ ...form, end_at: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Venue name (optional)
                                </label>
                                <Input
                                    value={form.venue_name}
                                    onChange={(e) => setForm({ ...form, venue_name: e.target.value })}
                                    placeholder="Arena Kigali"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Address (optional)
                                </label>
                                <Input
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    placeholder="KG 123 St"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    City (optional)
                                </label>
                                <Input
                                    value={form.city}
                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                    placeholder="Kigali"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Country (optional)
                                </label>
                                <Input
                                    value={form.country}
                                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                                    placeholder="Rwanda"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Price (optional)
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    placeholder="50"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Discount price (optional)
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={form.discount_price}
                                    onChange={(e) => setForm({ ...form, discount_price: e.target.value })}
                                    placeholder="35"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Active</p>
                                    <p className="text-xs text-muted-foreground">Visible to users</p>
                                </div>
                                <Switch
                                    checked={form.is_active}
                                    onCheckedChange={(val) => setForm({ ...form, is_active: val })}
                                />
                            </div>
                            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Verified</p>
                                    <p className="text-xs text-muted-foreground">Mark as verified event</p>
                                </div>
                                <Switch
                                    checked={form.is_verified}
                                    onCheckedChange={(val) => setForm({ ...form, is_verified: val })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Banner image (optional)
                            </label>
                            <Input type="file" accept="image/*" className="mt-2" onChange={handleFile} />
                            {form.banner ? (
                                <p className="mt-2 text-xs text-muted-foreground">{form.banner.name}</p>
                            ) : null}
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={!!form.remove_banner}
                                onCheckedChange={(val) => setForm({ ...form, remove_banner: val, banner: null })}
                            />
                            <span className="text-sm text-muted-foreground">Remove existing banner</span>
                        </div>
                    </div>
                )}

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={back}
                        disabled={step === 0 || isSubmitting}
                    >
                        Back
                    </Button>
                    {step < steps.length - 1 ? (
                        <Button
                            type="button"
                            className="rounded-full"
                            onClick={next}
                            disabled={!canNext || isSubmitting}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            className="rounded-full"
                            onClick={onSubmit}
                            disabled={isSubmitting || !form.title.trim()}
                        >
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save event
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventForm;
