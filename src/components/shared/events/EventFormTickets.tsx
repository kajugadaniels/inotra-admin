"use client";

import { Plus, Trash2 } from "lucide-react";

import { useMemo, useState } from "react";

import { EVENT_CATEGORIES } from "@/constants/event-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type { EventFormState, EventTicketState } from "./EventForm";

type Props = {
    form: EventFormState;
    setForm: (next: EventFormState) => void;
};

const EventFormTickets = ({ form, setForm }: Props) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [categorySearch, setCategorySearch] = useState("");

    const filteredCategories = useMemo(() => {
        const query = categorySearch.trim().toLowerCase();
        if (!query) return EVENT_CATEGORIES;
        return EVENT_CATEGORIES.filter((opt) => {
            const value = opt.value.toLowerCase();
            const label = opt.label.toLowerCase();
            return value.includes(query) || label.includes(query);
        });
    }, [categorySearch]);

    const addTicket = () => {
        setForm({
            ...form,
            tickets: [
                ...form.tickets,
                {
                    category: "REGULAR",
                    price: "",
                    consumable: false,
                    consumable_description: "",
                },
            ],
        });
    };

    const updateTicket = (index: number, next: Partial<EventTicketState>) => {
        const tickets = [...form.tickets];
        const current = tickets[index];
        if (!current) return;

        const merged: EventTicketState = { ...current, ...next };
        if (merged.category.trim().toUpperCase() === "FREE") {
            merged.price = "";
        }
        if (!merged.consumable) {
            merged.consumable_description = "";
        }
        if (!merged.category.trim()) {
            merged.category = "REGULAR";
        }

        tickets[index] = merged;

        const deduped: EventTicketState[] = [];
        const seen = new Set<string>();
        for (const ticket of tickets) {
            if (seen.has(ticket.category)) continue;
            seen.add(ticket.category);
            deduped.push(ticket);
        }

        setForm({ ...form, tickets: deduped });
    };

    const removeTicket = (index: number) => {
        setForm({ ...form, tickets: form.tickets.filter((_, i) => i !== index) });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-foreground">
                        Tickets (optional)
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Add ticket categories and pricing. Free tickets don’t require a price.
                    </p>
                </div>
                <Button type="button" variant="outline" className="h-11 rounded-full" onClick={addTicket}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add ticket
                </Button>
            </div>

            {form.tickets.length === 0 ? (
                <div className="rounded-3xl border border-border/60 bg-background/60 p-6 text-sm text-muted-foreground">
                    No tickets added yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {form.tickets.map((ticket, index) => (
                        <div
                            key={`${ticket.category}-${index}`}
                            className="grid gap-3 rounded-3xl border border-border/60 bg-background/60 p-4 md:grid-cols-[220px_1fr_auto]"
                        >
                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Category (required)
                                </label>
                                    <Select
                                        value={ticket.category}
                                        onValueChange={(value) =>
                                            updateTicket(index, {
                                                category: value as EventTicketState["category"],
                                            })
                                        }
                                        open={openIndex === index}
                                        onOpenChange={(open) => {
                                            setOpenIndex(open ? index : null);
                                            if (open) setCategorySearch("");
                                        }}
                                    >
                                        <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {openIndex === index ? (
                                                <div className="px-2 pt-2">
                                                    <Input
                                                        value={categorySearch}
                                                        onChange={(e) => setCategorySearch(e.target.value)}
                                                        onKeyDown={(e) => e.stopPropagation()}
                                                        onClick={(e) => e.stopPropagation()}
                                                        placeholder="Search categories"
                                                        className="admin-field h-9 rounded-xl border-border/60 bg-background/60"
                                                    />
                                                </div>
                                            ) : null}
                                            <div className="mt-2">
                                                {filteredCategories.length ? (
                                                    filteredCategories.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="px-2 py-2 text-xs text-muted-foreground">
                                                        No matching categories.
                                                    </div>
                                                )}
                                            </div>
                                        </SelectContent>
                                    </Select>
                            </div>

                            <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Price (required unless Free)
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={ticket.price}
                                    onChange={(e) => updateTicket(index, { price: e.target.value })}
                                    placeholder="20000"
                                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                                    disabled={ticket.category.trim().toUpperCase() === "FREE"}
                                />
                            </div>

                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="h-11 w-full rounded-full text-xs font-bold uppercase"
                                    onClick={() => removeTicket(index)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventFormTickets;
