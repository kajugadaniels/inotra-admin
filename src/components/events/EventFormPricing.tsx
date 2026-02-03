"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { EventFormState } from "./EventForm";

type Props = {
    form: EventFormState;
    setForm: (next: EventFormState) => void;
};

const EventFormPricing = ({ form, setForm }: Props) => (
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
);

export default EventFormPricing;
