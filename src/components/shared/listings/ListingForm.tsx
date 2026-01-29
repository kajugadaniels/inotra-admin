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

export type ListingServiceState = {
    name: string;
    is_available: boolean;
};

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
    services: ListingServiceState[];
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

    const normalizeWebsite = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return "";
        if (/^https?:\/\//i.test(trimmed)) {
            return trimmed;
        }
        return `https://${trimmed}`;
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Listing name (required)
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
                    Description (optional)
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
                        Address (optional)
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
                        City (optional)
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
                        Country (optional)
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
                        Phone (optional)
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
                        WhatsApp (optional)
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
                        Email (optional)
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
                        Website (optional)
                    </label>
                    <Input
                        value={form.website}
                        onChange={(event) =>
                            onChange({ ...form, website: normalizeWebsite(event.target.value) })
                        }
                        placeholder="https://listing.com"
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Latitude (optional)
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
                        Longitude (optional)
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

            <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Listing services (required)</p>
                        <p className="text-xs text-muted-foreground">
                            Add the services or features available at this listing.
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() =>
                            onChange({
                                ...form,
                                services: [
                                    ...form.services,
                                    { name: "", is_available: true },
                                ],
                            })
                        }
                        disabled={disabled}
                    >
                        Add service
                    </Button>
                </div>

                <div className="mt-4 space-y-3">
                    {form.services.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                            No services yet. Add at least one service before saving.
                        </p>
                    ) : (
                        form.services.map((service, index) => (
                            <div
                                key={`${service.name}-${index}`}
                                className="grid gap-3 rounded-2xl border border-border/60 bg-background/70 p-3 md:grid-cols-[1fr_auto_auto]"
                            >
                                <div>
                                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                        Service name (required)
                                    </label>
                                    <Input
                                        value={service.name}
                                        onChange={(event) => {
                                            const next = [...form.services];
                                            next[index] = {
                                                ...next[index],
                                                name: event.target.value,
                                            };
                                            onChange({ ...form, services: next });
                                        }}
                                        placeholder="Wi-Fi"
                                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                                        disabled={disabled}
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                        Available (optional)
                                    </label>
                                    <Select
                                        value={service.is_available ? "true" : "false"}
                                        onValueChange={(value) => {
                                            const next = [...form.services];
                                            next[index] = {
                                                ...next[index],
                                                is_available: value === "true",
                                            };
                                            onChange({ ...form, services: next });
                                        }}
                                        disabled={disabled}
                                    >
                                        <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60">
                                            <SelectValue placeholder="Availability" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">Available</SelectItem>
                                            <SelectItem value="false">Unavailable</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full rounded-full text-xs uppercase tracking-[0.2em] text-muted-foreground"
                                        onClick={() => {
                                            const next = form.services.filter((_, idx) => idx !== index);
                                            onChange({ ...form, services: next });
                                        }}
                                        disabled={disabled}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Opening hours (JSON, optional)
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
                        Status (optional)
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
                        Verification (optional)
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
                    Upload images (optional)
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
                            Existing images (optional)
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
