import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { ListingFormState, ListingServiceState } from "./ListingForm";

type ListingBasicInfoProps = {
    form: ListingFormState;
    categories: PlaceCategory[];
    disabled?: boolean;
    onChange: (next: ListingFormState) => void;
};

const ListingBasicInfo = ({ form, categories, disabled, onChange }: ListingBasicInfoProps) => {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div>
                <label className="text-sm">Listing name (required)</label>
                <Input
                    value={form.name}
                    onChange={(e) => onChange({ ...form, name: e.target.value })}
                    placeholder="Kigali City View"
                    className="mt-2 rounded-lg"
                    disabled={disabled}
                />
            </div>
            <div>
                <label className="text-sm">Listing category (optional)</label>
                <Select
                    value={form.categoryId || "uncategorized"}
                    onValueChange={(value) => onChange({ ...form, categoryId: value === "uncategorized" ? "" : value })}
                    disabled={disabled}
                >
                    <SelectTrigger className="mt-2 w-full rounded-lg">
                        <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="uncategorized">Uncategorized</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={String(category.id)}>
                                {category.name ?? "Untitled"}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default ListingBasicInfo;
