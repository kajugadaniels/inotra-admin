"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { PackageFormState } from "./PackageForm";

type Props = {
    form: PackageFormState;
    disabled?: boolean;
    onChange: (next: PackageFormState) => void;
};

const PackageFormBasics = ({ form, disabled = false, onChange }: Props) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Package title (required)
                </label>
                <Input
                    value={form.title}
                    onChange={(e) => onChange({ ...form, title: e.target.value })}
                    placeholder="Kigali Weekend Escape"
                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>

            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Description (optional)
                </label>
                <Textarea
                    value={form.description}
                    onChange={(e) => onChange({ ...form, description: e.target.value })}
                    placeholder="Describe what travelers should expect."
                    className="admin-field mt-2 min-h-[160px] rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Duration days (required)
                    </label>
                    <Input
                        type="number"
                        min={1}
                        value={form.duration_days}
                        onChange={(e) => onChange({ ...form, duration_days: e.target.value })}
                        placeholder="3"
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">Tip</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Activities are scheduled by day number (1..duration). Set the duration before adding the itinerary.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PackageFormBasics;

