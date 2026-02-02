/* eslint-disable @next/next/no-img-element */
import type { PlaceCategory } from "@/api/types";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ListingFormState } from "./ListingForm";

type ListingBasicInfoProps = {
    form: ListingFormState;
    categories: PlaceCategory[];
    disabled?: boolean;
    onChange: (next: ListingFormState) => void;
};

const ListingBasicInfo = ({
    form,
    categories,
    disabled = false,
    onChange,
}: ListingBasicInfoProps) => {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Listing name (required)
                    </label>
                    <Input
                        value={form.name}
                        onChange={(event) =>
                            onChange({ ...form, name: event.target.value })
                        }
                        placeholder="Kigali City View"
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60 text-xs"
                        disabled={disabled}
                    />
                </div>

                <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Listing category (optional)
                    </label>
                    <Select
                        value={form.categoryId || "uncategorized"}
                        onValueChange={(value) =>
                            onChange({
                                ...form,
                                categoryId: value === "uncategorized" ? "" : value,
                            })
                        }
                        disabled={disabled}
                    >
                        <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
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

            <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Description (optional)
                </label>
                <Textarea
                    value={form.description}
                    onChange={(event) =>
                        onChange({ ...form, description: event.target.value })
                    }
                    placeholder="Describe the listing experience in a premium way."
                    className="mt-2 h-[120px] rounded-2xl border-border/60 bg-background/60 text-xs"
                    rows={7}
                    disabled={disabled}
                />
            </div>

            <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Listing logo (optional)
                </label>
                {form.logoPreview ? (
                    <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
                        <img
                            src={form.logoPreview}
                            alt="Listing logo preview"
                            className="h-32 w-full object-contain bg-white"
                        />
                    </div>
                ) : null}
                <FileUpload
                    accept="image/*"
                    disabled={disabled}
                    label="Upload logo"
                    description="Square PNG/JPG up to 8MB"
                    onFileSelect={(file) => {
                        onChange({
                            ...form,
                            logo: file,
                            logoPreview: file ? URL.createObjectURL(file) : form.logoPreview,
                            removeLogo: file ? false : form.removeLogo,
                        });
                    }}
                />
                {form.logoPreview ? (
                    <button
                        type="button"
                        className="text-xs font-semibold text-destructive underline"
                        onClick={() =>
                            onChange({
                                ...form,
                                logo: null,
                                logoPreview: null,
                                removeLogo: true,
                            })
                        }
                        disabled={disabled}
                    >
                        Remove logo
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default ListingBasicInfo;
