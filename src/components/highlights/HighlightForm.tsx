"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPin, PlaySquare, UploadCloud } from "lucide-react";

import { listEvents } from "@/api/events";
import { listPlaces } from "@/api/places";
import { authStorage } from "@/api/auth";
import { getApiBaseUrl } from "@/config/api";
import type { EventListItem } from "@/api/events/listEvents";
import type { PlaceListItem } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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

const steps = [
    { key: "content", label: "Content" },
    { key: "links", label: "Place / event" },
    { key: "media", label: "Media" },
];

const HighlightForm = ({ form, setForm, isSubmitting, onSubmit, existingMedia = [] }: Props) => {
    const [mediaMarked, setMediaMarked] = useState<string[]>([]);
    const [step, setStep] = useState(0);

    const [placeQuery, setPlaceQuery] = useState("");
    const [eventQuery, setEventQuery] = useState("");
    const [places, setPlaces] = useState<PlaceListItem[]>([]);
    const [events, setEvents] = useState<EventListItem[]>([]);
    const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
    const tokens = authStorage.getTokens();

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!tokens?.access) return;
            if (!placeQuery.trim()) {
                setPlaces([]);
                return;
            }
            setIsLoadingPlaces(true);
            listPlaces({
                apiBaseUrl,
                accessToken: tokens.access,
                search: placeQuery.trim(),
                page: 1,
            })
                .then((res) => {
                    if (res.ok && res.body?.results) setPlaces(res.body.results);
                })
                .finally(() => setIsLoadingPlaces(false));
        }, 350);
        return () => clearTimeout(timeout);
    }, [apiBaseUrl, placeQuery, tokens?.access]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!tokens?.access) return;
            if (!eventQuery.trim()) {
                setEvents([]);
                return;
            }
            setIsLoadingEvents(true);
            listEvents({
                apiBaseUrl,
                accessToken: tokens.access,
                search: eventQuery.trim(),
                page: 1,
            })
                .then((res) => {
                    if (res.ok && res.body?.results) setEvents(res.body.results as EventListItem[]);
                })
                .finally(() => setIsLoadingEvents(false));
        }, 350);
        return () => clearTimeout(timeout);
    }, [apiBaseUrl, eventQuery, tokens?.access]);

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

    const canNext = useMemo(() => {
        if (step === 0) return true;
        if (step === 1) return true;
        if (step === 2) return form.images.length + form.videos.length > 0 || existingMedia.length > 0;
        return true;
    }, [existingMedia.length, form.images.length, form.videos.length, step]);

    return (
        <div className="space-y-6 rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5">
            <div className="flex flex-wrap gap-3">
                {steps.map((item, idx) => (
                    <button
                        key={item.key}
                        type="button"
                        onClick={() => setStep(idx)}
                        className={cn(
                            "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
                            step === idx
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border/60 text-muted-foreground hover:border-primary/60"
                        )}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {step === 0 && (
                <div className="space-y-4">
                    <div>
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
                </div>
            )}

            {step === 1 && (
                <div className="space-y-4">
                    <div>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Place (optional)
                        </label>
                        <div className="relative">
                            <Input
                                value={placeQuery}
                                onChange={(e) => setPlaceQuery(e.target.value)}
                                placeholder="Search place by name or city"
                                className="mt-2"
                            />
                            {placeQuery && (
                                <div className="absolute z-20 mt-1 w-full rounded-xl border border-border/60 bg-card/90 shadow-lg">
                                    <div className="max-h-56 overflow-auto">
                                        {isLoadingPlaces ? (
                                            <div className="px-3 py-2 text-xs text-muted-foreground">Searching…</div>
                                        ) : places.length === 0 ? (
                                            <div className="px-3 py-2 text-xs text-muted-foreground">No matches</div>
                                        ) : (
                                            places.map((place) => (
                                                <button
                                                    key={place.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setForm({ ...form, place_id: place.id ?? "" });
                                                        setPlaceQuery("");
                                                    }}
                                                    className={cn(
                                                        "flex w-full items-center justify-between px-3 py-2 text-sm text-left",
                                                        form.place_id === place.id
                                                            ? "bg-primary/10 text-primary"
                                                            : "hover:bg-muted/60"
                                                    )}
                                                >
                                                    <span className="truncate">{place.name ?? "Untitled place"}</span>
                                                    <span className="text-xs text-muted-foreground">{place.city}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Event (optional)
                        </label>
                        <div className="relative">
                            <Input
                                value={eventQuery}
                                onChange={(e) => setEventQuery(e.target.value)}
                                placeholder="Search event by title or venue"
                                className="mt-2"
                            />
                            {eventQuery && (
                                <div className="absolute z-20 mt-1 w-full rounded-xl border border-border/60 bg-card/90 shadow-lg">
                                    <div className="max-h-56 overflow-auto">
                                        {isLoadingEvents ? (
                                            <div className="px-3 py-2 text-xs text-muted-foreground">Searching…</div>
                                        ) : events.length === 0 ? (
                                            <div className="px-3 py-2 text-xs text-muted-foreground">No matches</div>
                                        ) : (
                                            events.map((event) => (
                                                <button
                                                    key={event.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setForm({ ...form, event_id: event.id ?? "" });
                                                        setEventQuery("");
                                                    }}
                                                    className={cn(
                                                        "flex w-full items-center justify-between px-3 py-2 text-sm text-left",
                                                        form.event_id === event.id
                                                            ? "bg-primary/10 text-primary"
                                                            : "hover:bg-muted/60"
                                                    )}
                                                >
                                                    <span className="truncate">{event.title ?? "Untitled event"}</span>
                                                    <span className="text-xs text-muted-foreground">{event.venue_name}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {form.place_id ? (
                                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                    <MapPin className="h-4 w-4" />
                                    Linked place
                                </span>
                            ) : null}
                            {form.event_id ? (
                                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                    <PlaySquare className="h-4 w-4" />
                                    Linked event
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
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
                </div>
            )}

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
                <div className="flex w-full flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                        disabled={step === 0 || isSubmitting}
                    >
                        Back
                    </Button>
                    {step < steps.length - 1 ? (
                        <Button
                            type="button"
                            className="rounded-full"
                            onClick={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))}
                            disabled={!canNext || isSubmitting}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            className="rounded-full"
                            onClick={onSubmit}
                            disabled={isSubmitting || !canNext}
                        >
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                            Save highlight
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HighlightForm;
