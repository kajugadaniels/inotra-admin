"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { EventFormState } from "./EventForm";

type Props = {
    form: EventFormState;
    setForm: (next: EventFormState) => void;
};

const EventFormPricing = ({ form, setForm }: Props) => {
    const updateTicket = (index: number, next: Partial<EventFormState["tickets"][number]>) => {
        const tickets = [...form.tickets];
        const current = tickets[index];
        if (!current) return;
        const merged = { ...current, ...next };
        if (!merged.consumable) {
            merged.consumable_description = "";
        }
        tickets[index] = merged;
        setForm({ ...form, tickets });
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Active (optional)</p>
                        <p className="text-xs text-muted-foreground">
                            When active, the event is visible in the app (subject to verification).
                        </p>
                    </div>
                    <Switch
                        checked={form.is_active}
                        onCheckedChange={(val) => setForm({ ...form, is_active: val })}
                    />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Verified (optional)</p>
                        <p className="text-xs text-muted-foreground">
                            Mark the event as verified to publish it publicly.
                        </p>
                    </div>
                    <Switch
                        checked={form.is_verified}
                        onCheckedChange={(val) => setForm({ ...form, is_verified: val })}
                    />
                </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-background/60 p-5">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Ticket consumption</p>
                        <p className="text-xs text-muted-foreground">
                            Mark tickets that must be consumed at entry and provide a short description.
                        </p>
                    </div>
                </div>

                {form.tickets.length === 0 ? (
                    <div className="mt-4 rounded-2xl border border-border/60 bg-background/60 p-4 text-sm text-muted-foreground">
                        Add tickets in the previous step to configure consumption.
                    </div>
                ) : (
                    <div className="mt-4 space-y-3">
                        {form.tickets.map((ticket, index) => (
                            <div
                                key={`${ticket.category}-${index}-consumable`}
                                className="rounded-2xl border border-border/60 bg-background/60 p-4"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{ticket.category}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Consumable tickets are scanned/validated at entry.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={ticket.consumable}
                                        onCheckedChange={(val) =>
                                            updateTicket(index, { consumable: val })
                                        }
                                    />
                                </div>

                                {ticket.consumable ? (
                                    <div className="mt-4">
                                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                            Consumable description (required)
                                        </label>
                                        <Input
                                            value={ticket.consumable_description}
                                            onChange={(e) =>
                                                updateTicket(index, {
                                                    consumable_description: e.target.value,
                                                })
                                            }
                                            placeholder="Scanned at gate, one-time entry"
                                            className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                                        />
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventFormPricing;
