"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { getHighlight, updateHighlight } from "@/api/highlights";
import type { Highlight } from "@/api/highlights/listHighlights";
import { getApiBaseUrl } from "@/config/api";
import HighlightForm, { defaultHighlightForm, type HighlightFormState } from "@/components/highlights/HighlightForm";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";

const EditHighlightPage = () => {
    const params = useParams();
    const router = useRouter();
    const highlightId = params?.highlightId as string | undefined;
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const [form, setForm] = useState<HighlightFormState>({ ...defaultHighlightForm });
    const [existingMedia, setExistingMedia] = useState<Highlight["media"]>([]);
    const [placeTitle, setPlaceTitle] = useState<string | null>(null);
    const [eventTitle, setEventTitle] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access || !highlightId) {
            toast.error("Session missing", { description: "Sign in again to edit highlight." });
            router.replace("/highlights");
            return;
        }
        getHighlight({ apiBaseUrl, accessToken: tokens.access, highlightId })
            .then((res) => {
                if (!res.ok || !res.body) {
                    toast.error("Unable to load highlight", { description: extractErrorDetail(res.body) });
                    router.replace("/highlights");
                    return;
                }
                const data = res.body as Highlight;
                setForm({
                    caption: data.caption ?? "",
                    place_id: data.place_id ?? "",
                    event_id: data.event_id ?? "",
                    images: [],
                    videos: [],
                    remove_media_ids: [],
                });
                setPlaceTitle((data as Highlight & { place_title?: string | null }).place_title ?? null);
                setEventTitle((data as Highlight & { event_title?: string | null }).event_title ?? null);
                setExistingMedia(data.media ?? []);
            })
            .catch((error: Error) => {
                toast.error("Unable to load highlight", {
                    description: error.message ?? "Check API connectivity.",
                });
                router.replace("/highlights");
            })
            .finally(() => setLoading(false));
    }, [apiBaseUrl, highlightId, router]);

    const handleSubmit = async () => {
        if (!highlightId) return;
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", { description: "Sign in again to update highlight." });
            return;
        }
        setSubmitting(true);
        try {
            const body = new FormData();
            if (form.caption !== undefined) body.append("caption", form.caption ?? "");
            body.append("place_id", form.place_id ?? "");
            body.append("event_id", form.event_id ?? "");
            form.images.forEach((file) => body.append("images", file));
            form.videos.forEach((file) => body.append("videos", file));
            form.remove_media_ids.forEach((id) => body.append("remove_media_ids", id));

            const res = await updateHighlight({
                apiBaseUrl,
                accessToken: tokens.access,
                highlightId,
                data: body,
            });
            const payload = res.body as { highlight?: Highlight } | null;
            if (!res.ok || !payload?.highlight) {
                toast.error("Update failed", { description: extractErrorDetail(res.body) });
                return;
            }
            toast.success("Highlight updated");
            router.push("/highlights");
        } catch (error) {
            toast.error("Update failed", {
                description: error instanceof Error ? error.message : "Check API connectivity.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 text-sm text-muted-foreground shadow-2xl shadow-black/5">
                Loading highlight...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Edit highlight</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Update caption, link to place or event, and manage media.
                        </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                            type="button"
                            className="rounded-full text-xs h-11"
                            variant="outline"
                            onClick={() => router.push("/highlights")}
                        >
                            <ArrowBigLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>

            <HighlightForm
                form={form}
                setForm={setForm}
                isSubmitting={submitting}
                onSubmit={handleSubmit}
                initialPlaceTitle={placeTitle ?? undefined}
                initialEventTitle={eventTitle ?? undefined}
                existingMedia={existingMedia}
            />
        </div>
    );
};

export default EditHighlightPage;
