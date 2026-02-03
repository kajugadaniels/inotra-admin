"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { getEvent, updateEvent } from "@/api/events";
import type { EventDetail } from "@/api/events/getEvent";
import { getApiBaseUrl } from "@/config/api";
import EventForm, { defaultEventForm, type EventFormState } from "@/components/events/EventForm";

const EditEventPage = () => {
    const router = useRouter();
    const params = useParams();
    const eventId = params?.eventId as string | undefined;
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
    const [form, setForm] = useState<EventFormState>({ ...defaultEventForm });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access || !eventId) {
            toast.error("Session missing", { description: "Sign in again to edit events." });
            router.replace("/events");
            return;
        }
        getEvent({ apiBaseUrl, accessToken: tokens.access, eventId })
            .then((res) => {
                if (!res.ok || !res.body) {
                    toast.error("Unable to load event", { description: extractErrorDetail(res.body) });
                    router.replace("/events");
                    return;
                }
                const ev = res.body as EventDetail;
                setForm({
                    title: ev.title ?? "",
                    description: ev.description ?? "",
                    start_at: ev.start_at ?? "",
                    end_at: ev.end_at ?? "",
                    venue_name: ev.venue_name ?? "",
                    address: ev.address ?? "",
                    city: ev.city ?? "",
                    country: ev.country ?? "Rwanda",
                    latitude: ev.latitude?.toString() ?? "",
                    longitude: ev.longitude?.toString() ?? "",
                    price: ev.price?.toString() ?? "",
                    discount_price: ev.discount_price?.toString() ?? "",
                    is_active: !!ev.is_active,
                    is_verified: !!ev.is_verified,
                    banner: null,
                    remove_banner: false,
                });
            })
            .catch((error: Error) => {
                toast.error("Unable to load event", {
                    description: error.message ?? "Check API connectivity.",
                });
                router.replace("/events");
            })
            .finally(() => setLoading(false));
    }, [apiBaseUrl, eventId, router]);

    const handleSubmit = async () => {
        if (!eventId) return;
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", { description: "Sign in again to update events." });
            return;
        }
        setIsSubmitting(true);
        try {
            const body = new FormData();
            if (form.title) body.append("title", form.title.trim());
            if (form.description) body.append("description", form.description);
            if (form.start_at) body.append("start_at", form.start_at);
            if (form.end_at) body.append("end_at", form.end_at);
            if (form.venue_name) body.append("venue_name", form.venue_name);
            if (form.address) body.append("address", form.address);
            if (form.city) body.append("city", form.city);
            if (form.country) body.append("country", form.country);
            if (form.latitude) body.append("latitude", form.latitude);
            if (form.longitude) body.append("longitude", form.longitude);
            if (form.price) body.append("price", form.price);
            if (form.discount_price) body.append("discount_price", form.discount_price);
            body.append("is_active", String(form.is_active));
            body.append("is_verified", String(form.is_verified));
            if (form.banner) {
                body.append("banner", form.banner);
            } else if (form.remove_banner) {
                body.append("remove_banner", "true");
            }

            const res = await updateEvent({
                apiBaseUrl,
                accessToken: tokens.access,
                eventId,
                data: body,
            });
            const payload = res.body as { event?: EventDetail } | null;
            if (!res.ok || !payload?.event) {
                toast.error("Update failed", { description: extractErrorDetail(res.body) });
                return;
            }
            toast.success("Event updated");
        } catch (error) {
            toast.error("Update failed", {
                description: error instanceof Error ? error.message : "Check API connectivity.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 text-sm text-muted-foreground shadow-2xl shadow-black/5">
                Loading event...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Edit event</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Update event details and status. Changes save when you submit the final step.
                </p>
            </div>

            <EventForm form={form} setForm={setForm} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
    );
};

export default EditEventPage;
