import { Input } from "@/components/ui/input";
import type { ListingFormState } from "./ListingForm";

type ListingLocationInfoProps = {
    form: ListingFormState;
    disabled?: boolean;
    onChange: (next: ListingFormState) => void;
};

const ListingLocationInfo = ({
    form,
    disabled = false,
    onChange,
}: ListingLocationInfoProps) => {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Address (optional)
                </label>
                <Input
                    value={form.address}
                    onChange={(event) =>
                        onChange({ ...form, address: event.target.value })
                    }
                    placeholder="KG 123 St"
                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    City (optional)
                </label>
                <Input
                    value={form.city}
                    onChange={(event) =>
                        onChange({ ...form, city: event.target.value })
                    }
                    placeholder="Kigali"
                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Latitude (optional)
                </label>
                <Input
                    value={form.latitude}
                    onChange={(event) =>
                        onChange({ ...form, latitude: event.target.value })
                    }
                    placeholder="-1.9439"
                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Longitude (optional)
                </label>
                <Input
                    value={form.longitude}
                    onChange={(event) =>
                        onChange({ ...form, longitude: event.target.value })
                    }
                    placeholder="30.0596"
                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

export default ListingLocationInfo;
