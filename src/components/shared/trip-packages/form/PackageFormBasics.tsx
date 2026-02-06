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
            <div className="grid gap-4 md:grid-cols-2">
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
            </div>

            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Description (optional)
                </label>
                <Textarea
                    value={form.description}
                    onChange={(e) => onChange({ ...form, description: e.target.value })}
                    placeholder="Describe what travelers should expect."
                    className="mt-2 h-[120px] rounded-2xl border-border/60 bg-background/60 text-xs"
                    rows={7}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

export default PackageFormBasics;

