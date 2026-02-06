"use client";

import { Switch } from "@/components/ui/switch";
import type { EventFormState } from "./EventForm";

type Props = {
    form: EventFormState;
    setForm: (next: EventFormState) => void;
};

const EventFormPricing = ({ form, setForm }: Props) => (
    <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                <div>
                    <p className="text-sm font-semibold text-foreground">Active (optional)</p>
                    <p className="text-xs text-muted-foreground">
                        When active, the event is visible in the app (subject to verification).
                    </p>
                </div>
                <Switch
                    checked={form.is_active}
                    onCheckedChange={(val) => setForm({ ...form, is_active: val })}
                />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                <div>
                    <p className="text-sm font-semibold text-foreground">Verified (optional)</p>
                    <p className="text-xs text-muted-foreground">
                        Mark the event as verified to publish it publicly.
                    </p>
                </div>
                <Switch
                    checked={form.is_verified}
                    onCheckedChange={(val) => setForm({ ...form, is_verified: val })}
                />
            </div>
        </div>
    </div>
);

export default EventFormPricing;
