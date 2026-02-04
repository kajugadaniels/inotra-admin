"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";

import type { ExistingPackageImage, PackageFormState } from "./PackageForm";

const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

type Props = {
    form: PackageFormState;
    disabled?: boolean;
    existingCoverUrl?: string | null;
    existingImages?: ExistingPackageImage[];
    onChange: (next: PackageFormState) => void;
};

const PackageFormMedia = ({
    form,
    disabled = false,
    existingCoverUrl = null,
    existingImages = [],
    onChange,
}: Props) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const coverPreviewUrl = useMemo(() => {
        if (!form.cover_file) return null;
        return URL.createObjectURL(form.cover_file);
    }, [form.cover_file]);

    const galleryPreviews = useMemo(
        () =>
            form.images.map((file) => ({
                name: file.name,
                size: file.size,
                url: URL.createObjectURL(file),
            })),
        [form.images]
    );

    useEffect(() => {
        return () => {
            if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
            galleryPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    }, [coverPreviewUrl, galleryPreviews]);

    const appendGallery = (files: File[]) => {
        if (!files.length) return;
        onChange({ ...form, images: [...form.images, ...files] });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        appendGallery(files);
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (disabled) return;
        setIsDragging(false);
        const files = Array.from(event.dataTransfer.files || []);
        appendGallery(files);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-3">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Cover image (optional)</p>
                        <p className="text-xs text-muted-foreground">
                            This is the primary image used in listings and previews.
                        </p>
                    </div>

                    {existingCoverUrl && !form.cover_file && !form.remove_cover ? (
                        <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/70">
                            <Image
                                src={existingCoverUrl}
                                alt="Current cover"
                                width={1200}
                                height={675}
                                className="h-44 w-full object-cover"
                            />
                            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                                <p className="text-xs text-muted-foreground">
                                    Current cover image
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-10 rounded-full text-xs"
                                    onClick={() => onChange({ ...form, remove_cover: true, cover_file: null })}
                                    disabled={disabled}
                                >
                                    Remove cover
                                </Button>
                            </div>
                        </div>
                    ) : null}

                    {form.cover_file ? (
                        <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/70">
                            {coverPreviewUrl ? (
                                <Image
                                    src={coverPreviewUrl}
                                    alt="New cover preview"
                                    width={1200}
                                    height={675}
                                    className="h-44 w-full object-cover"
                                />
                            ) : null}
                            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                                <p className="text-xs text-muted-foreground">
                                    New cover: <span className="font-semibold text-foreground">{form.cover_file.name}</span>
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-10 rounded-full text-xs"
                                    onClick={() => onChange({ ...form, cover_file: null })}
                                    disabled={disabled}
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                    ) : null}

                    <FileUpload
                        label="Upload cover"
                        description="Drag & drop or click to browse (JPG/PNG, up to 8MB)"
                        accept="image/*"
                        disabled={disabled}
                        onFileSelect={(file) =>
                            onChange({
                                ...form,
                                cover_file: file,
                                remove_cover: false,
                            })
                        }
                    />

                    {form.remove_cover && existingCoverUrl ? (
                        <div className="rounded-2xl border border-border/60 bg-amber-500/10 px-4 py-3 text-xs text-amber-900 dark:text-amber-200">
                            Cover will be removed when you save changes.
                            <Button
                                type="button"
                                variant="ghost"
                                className="ml-2 h-7 rounded-full px-2 text-[11px] uppercase tracking-[0.2em]"
                                onClick={() => onChange({ ...form, remove_cover: false })}
                                disabled={disabled}
                            >
                                Undo
                            </Button>
                        </div>
                    ) : null}
                </div>

                <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-foreground">Gallery images (optional)</p>
                            <p className="text-xs text-muted-foreground">
                                Add more images to showcase the package.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-11 rounded-full text-xs"
                            onClick={() => inputRef.current?.click()}
                            disabled={disabled}
                        >
                            Select images
                        </Button>
                    </div>

                    <div
                        onDragOver={(event) => {
                            event.preventDefault();
                            if (!disabled) setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`mt-2 flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed bg-background/60 px-6 py-6 text-center transition ${
                            isDragging ? "border-primary/70 bg-primary/10" : "border-border/60"
                        }`}
                    >
                        <p className="text-xs font-semibold text-foreground">Drag & drop images here</p>
                        <p className="text-xs text-muted-foreground">or click “Select images”</p>
                        <input
                            ref={inputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleInputChange}
                            className="hidden"
                            disabled={disabled}
                        />
                    </div>
                </div>
            </div>

            {galleryPreviews.length > 0 ? (
                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        New gallery uploads (optional)
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {galleryPreviews.map((preview, index) => (
                            <div
                                key={`${preview.name}-${index}`}
                                className="overflow-hidden rounded-2xl border border-border/60 bg-background/70"
                            >
                                <div className="relative h-32">
                                    <Image src={preview.url} alt={preview.name} fill className="object-cover" />
                                </div>
                                <div className="flex items-center justify-between gap-2 px-3 py-2">
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-semibold text-foreground">
                                            {preview.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatBytes(preview.size)}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="rounded-full text-xs uppercase tracking-[0.2em] text-muted-foreground"
                                        onClick={() =>
                                            onChange({
                                                ...form,
                                                images: form.images.filter((_, idx) => idx !== index),
                                            })
                                        }
                                        disabled={disabled}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}

            {existingImages.length > 0 ? (
                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Existing gallery images (optional)
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {existingImages.map((image) => {
                            const id = image.id ?? "";
                            const marked = id ? form.remove_image_ids.includes(id) : false;
                            return (
                                <button
                                    key={id || image.image_url || "image"}
                                    type="button"
                                    onClick={() => {
                                        if (!id) return;
                                        const next = marked
                                            ? form.remove_image_ids.filter((item) => item !== id)
                                            : [...form.remove_image_ids, id];
                                        onChange({ ...form, remove_image_ids: next });
                                    }}
                                    className={`overflow-hidden rounded-2xl border text-left transition ${
                                        marked
                                            ? "border-destructive bg-destructive/10"
                                            : "border-border/60 bg-background/70"
                                    }`}
                                    disabled={disabled || !id}
                                >
                                    {image.image_url ? (
                                        <Image
                                            src={image.image_url}
                                            alt={image.caption || "Package image"}
                                            width={320}
                                            height={220}
                                            className="h-32 w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
                                            No image
                                        </div>
                                    )}
                                    <div className="px-3 py-2">
                                        <p className="text-xs font-semibold text-foreground">
                                            {marked ? "Marked for removal" : "Click to remove"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
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

export default PackageFormMedia;

