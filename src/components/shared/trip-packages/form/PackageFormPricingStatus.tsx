"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import type { PackageFormState } from "./PackageForm";

type Props = {
    form: PackageFormState;
    disabled?: boolean;
    onChange: (next: PackageFormState) => void;
};

const PackageFormPricingStatus = ({ form, disabled = false, onChange }: Props) => {
    return (
        <div className="space-y-4">
            <div>
                <p className="text-sm font-semibold text-foreground">Pricing (optional)</p>
                <p className="text-xs text-muted-foreground">
                    If pricing is not set, the package can still be listed as an itinerary.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Price amount (optional)
                    </label>
                    <Input
                        type="number"
                        step="0.01"
                        value={form.price_amount}
                        onChange={(e) => onChange({ ...form, price_amount: e.target.value })}
                        placeholder="150"
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Currency (optional)
                    </label>
                    <Input
                        value={form.price_currency}
                        onChange={(e) =>
                            onChange({ ...form, price_currency: e.target.value.toUpperCase() })
                        }
                        placeholder="USD"
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Active</p>
                        <p className="text-xs text-muted-foreground">
                            When inactive, the package is hidden from users.
                        </p>
                    </div>
                    <Switch
                        checked={form.is_active}
                        onCheckedChange={(val) => onChange({ ...form, is_active: val })}
                        disabled={disabled}
                        className="data-[state=checked]:bg-primary"
                    />
                </div>
            </div>
        </div>
    );
};

export default PackageFormPricingStatus;

