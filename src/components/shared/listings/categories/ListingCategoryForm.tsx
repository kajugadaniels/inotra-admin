import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type ListingCategoryFormState = {
    name: string;
    icon: string;
    is_active: boolean;
};

type ListingCategoryFormProps = {
    form: ListingCategoryFormState;
    onChange: (next: ListingCategoryFormState) => void;
    disabled?: boolean;
};

const ListingCategoryForm = ({
    form,
    onChange,
    disabled = false,
}: ListingCategoryFormProps) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Listing category name (required)
                </label>
                <Input
                    value={form.name}
                    onChange={(event) =>
                        onChange({
                            ...form,
                            name: event.target.value,
                        })
                    }
                    placeholder="City View"
                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Icon (optional)
                </label>
                <Input
                    value={form.icon}
                    onChange={(event) => onChange({ ...form, icon: event.target.value })}
                    placeholder="map-pin"
                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Status (optional)
                </label>
                <Select
                    value={form.is_active ? "true" : "false"}
                    onValueChange={(value) =>
                        onChange({
                            ...form,
                            is_active: value === "true",
                        })
                    }
                    disabled={disabled}
                >
                    <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60">
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

export default ListingCategoryForm;
