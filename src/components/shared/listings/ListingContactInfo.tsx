import { Input } from "@/components/ui/input";
import type { ListingFormState } from "./ListingForm";

type ListingContactInfoProps = {
    form: ListingFormState;
    disabled?: boolean;
    onChange: (next: ListingFormState) => void;
};

const normalizeWebsite = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }
    return `https://${trimmed}`;
};

const ListingContactInfo = ({
    form,
    disabled = false,
    onChange,
}: ListingContactInfoProps) => {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Phone (optional)
                </label>
                <Input
                    value={form.phone}
                    onChange={(event) =>
                        onChange({ ...form, phone: event.target.value })
                    }
                    placeholder="+250 7xx xxx xxx"
                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    WhatsApp (optional)
                </label>
                <Input
                    value={form.whatsapp}
                    onChange={(event) =>
                        onChange({ ...form, whatsapp: event.target.value })
                    }
                    placeholder="+250 7xx xxx xxx"
                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Email (optional)
                </label>
                <Input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                        onChange({ ...form, email: event.target.value })
                    }
                    placeholder="info@listing.com"
                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Website (optional)
                </label>
                <Input
                    value={form.website}
                    onChange={(event) =>
                        onChange({
                            ...form,
                            website: normalizeWebsite(event.target.value),
                        })
                    }
                    placeholder="https://listing.com"
                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

export default ListingContactInfo;
