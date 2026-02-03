"use client";

import { useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type HighlightFormState = {
    caption: string;
    place_id: string;
    event_id: string;
    images: File[];
    videos: File[];
    remove_media_ids: string[];
};

export const defaultHighlightForm: HighlightFormState = {
    caption: "",
    place_id: "",
    event_id: "",
    images: [],
    videos: [],
    remove_media_ids: [],
};

type Props = {
    form: HighlightFormState;
    setForm: (next: HighlightFormState) => void;
    isSubmitting: boolean;
    onSubmit: () => Promise<void>;
    existingMedia?: { id?: string; caption?: string | null; media_type?: string; image_url?: string | null; video_url?: string | null }[];
};

const HighlightForm = ({ form, setForm, isSubmitting, onSubmit, existingMedia = [] }: Props) => {
    const [mediaMarked, setMediaMarked] = useState<string[]>([]);

    const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setForm({ ...form, images: files });
    };
    const handleVideos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setForm({ ...form, videos: files });
    };

    const toggleRemove = (id?: string) => {
        if (!id) return;
        setMediaMarked((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
        setForm({
            ...form,
            remove_media_ids: mediaMarked.includes(id)
                ? mediaMarked.filter((item) => item !== id)
                : [...mediaMarked, id],
        });
    };

    return (
        <div className="space-y-6 rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Caption (optional)
                    </label>
                    <Textarea
                        value={form.caption}
                        onChange={(e) => setForm({ ...form, caption: e.target.value })}
                        placeholder="Say something about this highlight..."
                        className="mt-2"
                    />
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Place ID (optional)
                    </label>
                    <Input
                        value={form.place_id}
                        onChange={(e) => setForm({ ...form, place_id: e.target.value })}
                        placeholder="UUID of place"
                        className="mt-2"
                    />
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Event ID (optional)
                    </label>
                    <Input
                        value={form.event_id}
                        onChange={(e) => setForm({ ...form, event_id: e.target.value })}
                        placeholder="UUID of event"
                        className="mt-2"
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Images (optional)
                    </label>
                    <Input type="file" accept="image/*" multiple className="mt-2" onChange={handleImages} />
                    {form.images.length ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                            {form.images.length} image(s) selected.
                        </p>
                    ) : null}
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Videos (optional)
                    </label>
                    <Input type="file" accept="video/*" multiple className="mt-2" onChange={handleVideos} />
                    {form.videos.length ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                            {form.videos.length} video(s) selected.
                        </p>
                    ) : null}
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
                                        marked
                                            ? "border-destructive bg-destructive/10"
                                            : "border-border/60 bg-background/70"
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

            <div className="flex justify-end">
                <Button
                    type="button"
                    className="h-11 rounded-full"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                    Save highlight
                </Button>
            </div>
        </div>
    );
};

export default HighlightForm;
