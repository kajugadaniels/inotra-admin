"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon, Trash2, UploadCloud, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { EventFormState } from "./EventForm";

type Props = {
    form: EventFormState;
    setForm: (next: EventFormState) => void;
};

const EventFormMedia = ({ form, setForm }: Props) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles?.[0] ?? null;
            if (!file) return;

            // Set banner + ensure remove_banner is false
            setForm({ ...form, banner: file, remove_banner: false });
        },
        [form, setForm]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
        onDrop,
        multiple: false,
        maxFiles: 1,
        noClick: true, // we control click with the "Browse" button
        noKeyboard: true,
        disabled: !!form.remove_banner,
        accept: {
            "image/*": [],
        },
    });

    // Create / cleanup preview URL
    useEffect(() => {
        if (!form.banner) {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(form.banner);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [form.banner]);

    const helperText = useMemo(() => {
        if (form.remove_banner) return "Banner removal is enabled. Upload is disabled.";
        if (isDragReject) return "Unsupported file. Please drop an image file.";
        if (isDragActive) return "Drop the image here…";
        return "Drag & drop an image here, or click Browse.";
    }, [form.remove_banner, isDragActive, isDragReject]);

    const clearSelected = () => {
        setForm({ ...form, banner: null });
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Banner image (optional)
                </label>

                <div
                    {...getRootProps()}
                    className={cn(
                        "mt-2 rounded-3xl border border-border/60 bg-card/60 p-4 shadow-sm backdrop-blur-xl transition",
                        form.remove_banner && "opacity-60",
                        isDragActive && !isDragReject && "border-primary/40 bg-primary/5",
                        isDragReject && "border-destructive/40 bg-destructive/5"
                    )}
                >
                    <input {...getInputProps()} />

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-background/60">
                                {form.banner ? (
                                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                    <UploadCloud className="h-5 w-5 text-muted-foreground" />
                                )}
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground">Upload banner</p>
                                <p className="mt-1 text-xs text-muted-foreground">{helperText}</p>

                                {form.banner ? (
                                    <p className="mt-2 truncate text-xs text-muted-foreground">
                                        Selected: <span className="font-medium text-foreground">{form.banner.name}</span>
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 rounded-full text-xs"
                                onClick={open}
                                disabled={!!form.remove_banner}
                            >
                                <UploadCloud className="mr-2 h-4 w-4" />
                                Browse
                            </Button>

                            {form.banner ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="h-11 rounded-full text-xs text-muted-foreground"
                                    onClick={clearSelected}
                                >
                                    <XIcon className="mr-2 h-4 w-4" />
                                    Clear
                                </Button>
                            ) : null}
                        </div>
                    </div>

                    {previewUrl ? (
                        <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-background/40">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={previewUrl}
                                alt="Banner preview"
                                className="h-44 w-full object-cover"
                            />
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/60 px-4 py-3">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">Remove existing banner</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Enable this to remove the current banner on save.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {form.remove_banner ? (
                        <div className="hidden items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs text-destructive sm:flex">
                            <Trash2 className="h-3.5 w-3.5" />
                            Removal enabled
                        </div>
                    ) : null}

                    <Switch
                        checked={!!form.remove_banner}
                        onCheckedChange={(val) =>
                            setForm({ ...form, remove_banner: val, banner: val ? null : form.banner })
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default EventFormMedia;
