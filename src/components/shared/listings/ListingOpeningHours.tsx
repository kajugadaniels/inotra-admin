import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { DayKey, ListingFormState, OpeningHoursState } from "./ListingForm";

type ListingOpeningHoursProps = {
    form: ListingFormState;
    disabled?: boolean;
    onChange: (next: ListingFormState) => void;
};

const DAY_LABELS: Record<DayKey, string> = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
};

const ListingOpeningHours = ({
    form,
    disabled = false,
    onChange,
}: ListingOpeningHoursProps) => {
    const updateDay = (day: DayKey, next: Partial<OpeningHoursState[DayKey]>) => {
        onChange({
            ...form,
            openingHours: {
                ...form.openingHours,
                [day]: {
                    ...form.openingHours[day],
                    ...next,
                },
            },
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-foreground">
                        Opening hours (optional)
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Set availability for each day of the week.
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {(Object.keys(DAY_LABELS) as DayKey[]).map((day) => {
                    const value = form.openingHours[day];
                    return (
                        <div
                            key={day}
                            className="grid gap-3 rounded-2xl border border-border/60 bg-background/70 p-3 md:grid-cols-[160px_repeat(2,1fr)_auto]"
                        >
                            <div className="flex flex-col justify-center">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    {DAY_LABELS[day]}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {value.closed ? "Closed" : "Open"}
                                </p>
                            </div>
                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Opens (required)
                                </label>
                                <Input
                                    type="time"
                                    value={value.open}
                                    onChange={(event) =>
                                        updateDay(day, { open: event.target.value })
                                    }
                                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                                    disabled={disabled || value.closed}
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Closes (required)
                                </label>
                                <Input
                                    type="time"
                                    value={value.close}
                                    onChange={(event) =>
                                        updateDay(day, { close: event.target.value })
                                    }
                                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                                    disabled={disabled || value.closed}
                                />
                            </div>
                            <div className="flex items-end justify-end gap-2">
                                <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-2">
                                    <Switch
                                        checked={!value.closed}
                                        onCheckedChange={(checked) =>
                                            updateDay(day, { closed: !checked })
                                        }
                                        disabled={disabled}
                                    />
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        Open
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ListingOpeningHours;
