"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { PackageActivityState, PackageFormState } from "./PackageForm";

type Props = {
    form: PackageFormState;
    disabled?: boolean;
    onChange: (next: PackageFormState) => void;
};

const PackageFormActivities = ({ form, disabled = false, onChange }: Props) => {
    const durationDays = Number.parseInt(form.duration_days, 10);
    const hasDuration = Number.isFinite(durationDays) && durationDays > 0;

    const addActivity = () => {
        const next: PackageActivityState[] = [
            ...form.activities,
            { activity_name: "", time: "" },
        ];
        onChange({ ...form, activities: next });
    };

    const updateActivity = (index: number, patch: Partial<PackageActivityState>) => {
        const next = [...form.activities];
        next[index] = { ...next[index], ...patch };
        onChange({ ...form, activities: next });
    };

    const removeActivity = (index: number) => {
        onChange({ ...form, activities: form.activities.filter((_, i) => i !== index) });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-foreground">Package activities (optional)</p>
                    <p className="text-xs text-muted-foreground">
                        Define the itinerary by day. If you add activities, day number must be within the package duration.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-full text-xs"
                    onClick={addActivity}
                    disabled={disabled}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add activity
                </Button>
            </div>

            {!hasDuration ? (
                <div className="rounded-2xl border border-border/60 bg-amber-500/10 px-4 py-3 text-xs text-amber-900 dark:text-amber-200">
                    Set <span className="font-semibold">Duration days</span> in the previous step to validate activity day numbers.
                </div>
            ) : null}

            {form.activities.length === 0 ? (
                <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-8 text-center text-xs text-muted-foreground">
                    No activities added yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {form.activities.map((activity, index) => (
                        <div
                            key={`${activity.activity_name}-${index}`}
                            className="grid gap-3 rounded-2xl border border-border/60 bg-background/60 p-4 md:grid-cols-[1fr_180px_auto]"
                        >
                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Activity name (required)
                                </label>
                                <Input
                                    value={activity.activity_name}
                                    onChange={(e) => updateActivity(index, { activity_name: e.target.value })}
                                    placeholder="City tour"
                                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/70"
                                    disabled={disabled}
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Day number (required)
                                </label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={hasDuration ? durationDays : undefined}
                                    value={activity.time}
                                    onChange={(e) => updateActivity(index, { time: e.target.value })}
                                    placeholder="1"
                                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/70"
                                    disabled={disabled}
                                />
                                {hasDuration &&
                                activity.time &&
                                Number.parseInt(activity.time, 10) > durationDays ? (
                                    <p className="mt-2 text-[11px] text-destructive">
                                        Must be within 1..{durationDays}.
                                    </p>
                                ) : null}
                            </div>

                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-full text-destructive"
                                    onClick={() => removeActivity(index)}
                                    disabled={disabled}
                                    aria-label="Remove activity"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PackageFormActivities;

