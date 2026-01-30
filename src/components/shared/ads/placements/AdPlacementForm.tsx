import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type AdPlacementFormState = {
    key: string;
    title: string;
    is_active: boolean;
};

type AdPlacementFormProps = {
    form: AdPlacementFormState;
    onChange: (next: AdPlacementFormState) => void;
    disabled?: boolean;
};

const normalizePlacementKey = (value: string) => {
    return value.replace(/\s+/g, "_").toUpperCase();
};

const AdPlacementForm = ({ form, onChange, disabled = false }: AdPlacementFormProps) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Placement key (required)
                </label>
                <Input
                    value={form.key}
                    onChange={(event) =>
                        onChange({
                            ...form,
                            key: normalizePlacementKey(event.target.value),
                        })
                    }
                    placeholder="HOME_FEED_TOP"
                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>
            <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Title (optional)
                </label>
                <Input
                    value={form.title}
                    onChange={(event) => onChange({ ...form, title: event.target.value })}
                    placeholder="Homepage hero banner"
                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>
            <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Status (optional)
                </label>
                <Select
                    value={form.is_active ? "true" : "false"}
                    onValueChange={(value) =>
                        onChange({ ...form, is_active: value === "true" })
                    }
                    disabled={disabled}
                >
                    <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default AdPlacementForm;
