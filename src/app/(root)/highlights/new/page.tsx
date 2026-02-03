"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { createHighlight } from "@/api/highlights";
import { getApiBaseUrl } from "@/config/api";
import HighlightForm, { defaultHighlightForm, type HighlightFormState } from "@/components/highlights/HighlightForm";

const NewHighlightPage = () => {
    const router = useRouter();
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
    const [form, setForm] = useState<HighlightFormState>({ ...defaultHighlightForm });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", { description: "Sign in again to create highlights." });
            return;
        }
        setSubmitting(true);
        try {
            const body = new FormData();
            if (form.caption) body.append("caption", form.caption);
            if (form.place_id) body.append("place_id", form.place_id);
            if (form.event_id) body.append("event_id", form.event_id);
            form.images.forEach((file) => body.append("images", file));
            form.videos.forEach((file) => body.append("videos", file));

            const res = await createHighlight({
                apiBaseUrl,
                accessToken: tokens.access,
                data: body,
            });

            const payload = res.body as { highlight?: { id?: string } } | null;
            if (!res.ok || !payload?.highlight) {
                toast.error("Creation failed", { description: extractErrorDetail(res.body) });
                return;
            }
            toast.success("Highlight created");
            router.push("/highlights");
        } catch (error) {
            toast.error("Creation failed", {
                description: error instanceof Error ? error.message : "Check API connectivity.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Create highlight</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Upload one or more images or videos. Caption is optional.
                </p>
            </div>

            <HighlightForm form={form} setForm={setForm} isSubmitting={submitting} onSubmit={handleSubmit} />
        </div>
    );
};

export default NewHighlightPage;
