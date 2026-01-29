import Image from "next/image";

import type { PlaceCategory, PlaceImage } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export type ListingFormState = {
    name: string;
    categoryId: string;
    description: string;
    address: string;
    city: string;
    country: string;
    latitude: string;
    longitude: string;
    phone: string;
    whatsapp: string;
    email: string;
    website: string;
    openingHours: string;
    is_verified: boolean;
    is_active: boolean;
    images: File[];
    removeImageIds: string[];
};

type ListingFormProps = {
    form: ListingFormState;
    categories: PlaceCategory[];
    existingImages?: PlaceImage[];
    disabled?: boolean;
    onChange: (next: ListingFormState) => void;
    onImagesChange: (files: File[]) => void;
    onToggleRemoveImage?: (imageId: string) => void;
};

const ListingForm = ({
    form,
    categories,
    existingImages = [],
    disabled = false,
    onChange,
    onImagesChange,
    onToggleRemoveImage,
}: ListingFormProps) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        onImagesChange(files);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Listing name
                    </label>
                    <Input
                        value={form.name}
                        onChange={(event) => onChange({ ...form, name: event.target.value })}
                        placeholder="Kigali City View"
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                </div>

                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Listing category
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
                        <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60">
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
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Description
                </label>
                <Textarea
                    value={form.description}
                    onChange={(event) => onChange({ ...form, description: event.target.value })}
                    placeholder="Describe the listing experience."
                    className="admin-field mt-2 min-h-[120px] rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Address
                    </label>
                    <Input
                        value={form.address}
                        onChange={(event) => onChange({ ...form, address: event.target.value })}
                        placeholder="KG 123 St"
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        City
                    </label>
                    <Input
                        value={form.city}
                        onChange={(event) => onChange({ ...form, city: event.target.value })}
                        placeholder="Kigali"
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Country
                    </label>
                    <Input
                        value={form.country}
                        onChange={(event) => onChange({ ...form, country: event.target.value })}
                        placeholder="Rwanda"
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Phone
                    </label>
                    <Input
                        value={form.phone}
                        onChange={(event) => onChange({ ...form, phone: event.target.value })}
                        placeholder="+250 7xx xxx xxx"
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        WhatsApp
                    </label>
                    <Input
                        value={form.whatsapp}
                        onChange={(event) => onChange({ ...form, whatsapp: event.target.value })}
                        placeholder="+250 7xx xxx xxx"
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Email
                    </label>
                    <Input
                        value={form.email}
                        onChange={(event) => onChange({ ...form, email: event.target.value })}
                        placeholder="info@listing.com"
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Website
                    </label>
                    <Input
                        value={form.website}
                        onChange={(event) => onChange({ ...form, website: event.target.value })}
                        placeholder="https://listing.com"
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Latitude
                    </label>
                    <Input
                        value={form.latitude}
                        onChange={(event) => onChange({ ...form, latitude: event.target.value })}
                        placeholder="-1.9439"
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Longitude
                    </label>
                    <Input
                        value={form.longitude}
                        onChange={(event) => onChange({ ...form, longitude: event.target.value })}
                        placeholder="30.0596"
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                </div>
            </div>

            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Opening hours (JSON)
                </label>
                <Textarea
                    value={form.openingHours}
                    onChange={(event) => onChange({ ...form, openingHours: event.target.value })}
                    placeholder='{"mon":{"open":"08:00","close":"18:00"}}'
                    className="admin-field mt-2 min-h-[120px] rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Status
                    </label>
                    <Select
                        value={form.is_active ? "true" : "false"}
                        onValueChange={(value) => onChange({ ...form, is_active: value === "true" })}
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
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Verification
                    </label>
                    <Select
                        value={form.is_verified ? "true" : "false"}
                        onValueChange={(value) =>
                            onChange({ ...form, is_verified: value === "true" })
                        }
                        disabled={disabled}
                    >
                        <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60">
                            <SelectValue placeholder="Verification" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Verified</SelectItem>
                            <SelectItem value="false">Unverified</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Upload images
                </label>
                <Input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
                {form.images.length ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                        {form.images.length} new image(s) selected.
                    </p>
                ) : null}
            </div>

            {existingImages.length ? (
                <div>
                    <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Existing images
                        </p>
                        {onToggleRemoveImage ? (
                            <p className="text-xs text-muted-foreground">
                                Toggle to remove images
                            </p>
                        ) : null}
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {existingImages.map((image) => {
                            const marked = form.removeImageIds.includes(String(image.id));
                            return (
                                <button
                                    key={image.id}
                                    type="button"
                                    onClick={() => onToggleRemoveImage?.(String(image.id))}
                                    className={`overflow-hidden rounded-2xl border transition ${
                                        marked
                                            ? "border-destructive bg-destructive/10"
                                            : "border-border/60 bg-background/70"
                                    }`}
                                    disabled={disabled || !onToggleRemoveImage}
                                >
                                    {image.image_url ? (
                                        <Image
                                            src={image.image_url}
                                            alt={image.caption || "Listing image"}
                                            width={320}
                                            height={220}
                                            className="h-32 w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
                                            No image
                                        </div>
                                    )}
                                    <div className="px-3 py-2 text-left">
                                        <p className="text-xs font-semibold text-foreground">
                                            {marked ? "Marked for removal" : "Click to remove"}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {image.caption || "No caption"}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default ListingForm;
