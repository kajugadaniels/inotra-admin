import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { ListingFormState } from "./ListingForm";

type ListingStatusProps = {
    form: ListingFormState;
    disabled?: boolean;
    onChange: (next: ListingFormState) => void;
};

const ListingStatus = ({
    form,
    disabled = false,
    onChange,
}: ListingStatusProps) => {
    return (
        <div className="grid gap-4 md:grid-cols-2">
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
                    <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Verification (optional)
                </label>
                <Select
                    value={form.is_verified ? "true" : "false"}
                    onValueChange={(value) =>
                        onChange({ ...form, is_verified: value === "true" })
                    }
                    disabled={disabled}
                >
                    <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                        <SelectValue placeholder="Verification" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">Verified</SelectItem>
                        <SelectItem value="false">Unverified</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default ListingStatus;
