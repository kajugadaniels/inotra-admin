"use client";

import { UploadCloud } from "lucide-react";

import { Input } from "@/components/ui/input";
import type { HighlightFormState } from "./HighlightForm";

type Media = {
    id?: string;
    caption?: string | null;
    media_type?: string;
    image_url?: string | null;
    video_url?: string | null;
};

type Props = {
    form: HighlightFormState;
    setForm: (next: HighlightFormState) => void;
    existingMedia: Media[];
    mediaMarked: string[];
    toggleRemove: (id?: string) => void;
};

const HighlightFormMedia = ({ form, setForm, existingMedia, mediaMarked, toggleRemove }: Props) => {
    const handleDrop = (files: FileList | null) => {
        if (!files) return;
        const nextImages: File[] = [];
        const nextVideos: File[] = [];
        Array.from(files).forEach((file) => {
            if (file.type.startsWith("image/")) nextImages.push(file);
            else if (file.type.startsWith("video/")) nextVideos.push(file);
        });
        setForm({
            ...form,
            images: [...form.images, ...nextImages],
            videos: [...form.videos, ...nextVideos],
        });
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleDrop(e.target.files);
    };

    return (
        <div className="space-y-4">
            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    handleDrop(e.dataTransfer.files);
                }}
                className="rounded-2xl border-2 border-dashed border-border/70 bg-muted/40 px-4 py-6 text-center transition hover:border-primary/70 hover:bg-muted/60"
            >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UploadCloud className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">Upload media</p>
                <p className="text-xs text-muted-foreground">
                    Drag & drop images or videos. We will sort them automatically.
                </p>
                <div className="mt-4 flex justify-center">
                    <Input type="file" accept="image/*,video/*" multiple onChange={handleFileInput} className="max-w-xs" />
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                    <p className="text-sm font-semibold text-foreground">Images</p>
                    <p className="text-xs text-muted-foreground">{form.images.length} selected</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                    <p className="text-sm font-semibold text-foreground">Videos</p>
                    <p className="text-xs text-muted-foreground">{form.videos.length} selected</p>
                </div>
            </div>

            {existingMedia.length > 0 ? (
                <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Existing media (toggle to remove)
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {existingMedia.map((media) => {
                            const marked = mediaMarked.includes(media.id ?? "");
                            return (
                                <button
                                    key={media.id}
                                    type="button"
                                    onClick={() => toggleRemove(media.id)}
                                    className={`overflow-hidden rounded-2xl border text-left transition ${
                                        marked ? "border-destructive bg-destructive/10" : "border-border/60 bg-background/70"
                                    }`}
                                >
                                    <div className="p-3 text-xs font-semibold text-foreground">
                                        {media.media_type ?? "MEDIA"}
                                    </div>
                                    <div className="px-3 pb-3 text-[11px] text-muted-foreground">
                                        {marked ? "Marked for removal" : media.caption ?? "Tap to remove"}
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

export default HighlightFormMedia;
