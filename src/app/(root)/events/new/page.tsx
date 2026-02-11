"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { createEvent } from "@/api/events";
import { getApiBaseUrl } from "@/config/api";
import EventForm, { defaultEventForm, type EventFormState } from "@/components/shared/events/EventForm";

const NewEventPage = () => {
    const router = useRouter();
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
    const [form, setForm] = useState<EventFormState>({ ...defaultEventForm });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", { description: "Sign in again to create events." });
            return;
        }
        setIsSubmitting(true);
        try {
            const body = new FormData();
            body.append("title", form.title.trim());
            if (form.description) body.append("description", form.description);
            if (form.start_at) body.append("start_at", form.start_at);
            if (form.end_at) body.append("end_at", form.end_at);
            if (form.venue_name) body.append("venue_name", form.venue_name);
            if (form.address) body.append("address", form.address);
            if (form.city) body.append("city", form.city);
            if (form.country) body.append("country", form.country);
            if (form.latitude) body.append("latitude", form.latitude);
            if (form.longitude) body.append("longitude", form.longitude);
            if (form.tickets.length) {
                const ticketsPayload = form.tickets.map((ticket) => ({
                    category: ticket.category,
                    ...(ticket.category.trim().toUpperCase() === "FREE"
                        ? {}
                        : ticket.price.trim()
                            ? { price: ticket.price.trim() }
                            : {}),
                    consumable: ticket.consumable,
                    ...(ticket.consumable && ticket.consumable_description.trim()
                        ? { consumable_description: ticket.consumable_description.trim() }
                        : {}),
                }));
                body.append("tickets", JSON.stringify(ticketsPayload));
            }
            body.append("is_active", String(form.is_active));
            body.append("is_verified", String(form.is_verified));
            if (form.banner) body.append("banner", form.banner);

            const res = await createEvent({
                apiBaseUrl,
                accessToken: tokens.access,
                data: body,
            });

            const payload = res.body as { event?: { id?: string } } | null;
            if (!res.ok || !payload?.event) {
                toast.error("Creation failed", { description: extractErrorDetail(res.body) });
                return;
            }

            toast.success("Event created");
            router.replace("/events");
        } catch (error) {
            toast.error("Creation failed", {
                description: error instanceof Error ? error.message : "Check API connectivity.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Create event</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Use the wizard to add a new event. Title is required; other fields are optional.
                </p>
            </div>

            <EventForm form={form} setForm={setForm} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
    );
};

export default NewEventPage;
