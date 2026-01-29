import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import type { PlaceImage } from "@/api/types";
import { Button } from "@/components/ui/button";

const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

type ListingImagesProps = {
    images: File[];
    existingImages?: PlaceImage[];
    removeImageIds?: string[];
    disabled?: boolean;
    onImagesChange: (files: File[]) => void;
    onToggleRemoveImage?: (imageId: string) => void;
};

const ListingImages = ({
    images,
    existingImages = [],
    removeImageIds = [],
    disabled = false,
    onImagesChange,
    onToggleRemoveImage,
}: ListingImagesProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const previews = useMemo(
        () =>
            images.map((file) => ({
                name: file.name,
                size: file.size,
                url: URL.createObjectURL(file),
            })),
        [images]
    );

    useEffect(() => {
        return () => {
            previews.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    }, [previews]);

    const appendFiles = (files: File[]) => {
        if (!files.length) return;
        const next = [...images, ...files];
        onImagesChange(next);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        appendFiles(files);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (disabled) return;
        setIsDragging(false);
        const files = Array.from(event.dataTransfer.files || []);
        appendFiles(files);
    };

    return (
        <div className="space-y-4">
            <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-foreground">
                            Images (optional)
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Upload high-quality images to showcase the listing.
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
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
                    className={`mt-4 flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed bg-background/60 px-6 py-6 text-center transition ${
                        isDragging
                            ? "border-primary/70 bg-primary/10"
                            : "border-border/60"
                    }`}
                >
                    <p className="text-sm font-semibold text-foreground">
                        Drag & drop images here
                    </p>
                    <p className="text-xs text-muted-foreground">
                        or click the button above to browse your files
                    </p>
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        onChange={handleInputChange}
                        className="hidden"
                        disabled={disabled}
                    />
                </div>
            </div>

            {previews.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {previews.map((preview, index) => (
                        <div
                            key={`${preview.name}-${index}`}
                            className="overflow-hidden rounded-2xl border border-border/60 bg-background/70"
                        >
                            <div className="relative h-32">
                                <Image
                                    src={preview.url}
                                    alt={preview.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex items-center justify-between gap-2 px-3 py-2">
                                <div>
                                    <p className="text-xs font-semibold text-foreground">
                                        {preview.name}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {formatBytes(preview.size)}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="rounded-full text-xs uppercase tracking-[0.2em] text-muted-foreground"
                                    onClick={() =>
                                        onImagesChange(
                                            images.filter((_, idx) => idx !== index)
                                        )
                                    }
                                    disabled={disabled}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}

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
                            const marked = removeImageIds.includes(String(image.id));
                            return (
                                <button
                                    key={image.id}
                                    type="button"
                                    onClick={() =>
                                        onToggleRemoveImage?.(String(image.id))
                                    }
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
                                            {marked
                                                ? "Marked for removal"
                                                : "Click to remove"}
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

export default ListingImages;
