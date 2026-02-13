"use client";

import { useState } from "react";

import type { EventSubmissionDetail } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type Props = {
    submission: EventSubmissionDetail | null;
    isLoading: boolean;
};

const formatTicketPrice = (value?: string | number | null) => {
    if (value === null || value === undefined || value === "") return "Free";
    const numeric = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(numeric)) return String(value);
    return Intl.NumberFormat(undefined, { style: "currency", currency: "RWF" }).format(numeric);
};

const EventSubmissionTickets = ({ submission, isLoading }: Props) => {
    const [activeConsumable, setActiveConsumable] = useState<{
        category: string;
        description: string;
    } | null>(null);

    if (isLoading && !submission) {
        return (
            <div className="rounded-3xl border border-border/60 bg-background/60 p-6 text-xs text-muted-foreground">
                Loading tickets...
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="rounded-3xl border border-border/60 bg-background/60 p-6 text-xs text-muted-foreground">
                Submission details unavailable.
            </div>
        );
    }

    return (
        <>
            <div className="grid w-full grid-cols-1 gap-4">
                <div className="rounded-3xl border border-border/60 bg-background/60 p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Tickets
                    </p>
                    {submission.tickets && submission.tickets.length > 0 ? (
                        <div className="mt-4 space-y-2 text-sm">
                            {submission.tickets.map((ticket) => (
                                <div key={ticket.id} className="flex items-center justify-between gap-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-muted-foreground">{ticket.category}</span>
                                        {ticket.consumable ? (
                                            <Badge
                                                asChild
                                                variant="outline"
                                                className="border-primary/40 text-primary"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveConsumable({
                                                            category: ticket.category ?? "Ticket",
                                                            description:
                                                                ticket.consumable_description?.trim() ||
                                                                "No description provided.",
                                                        })
                                                    }
                                                    className="cursor-pointer"
                                                >
                                                    Consumable
                                                </button>
                                            </Badge>
                                        ) : null}
                                    </div>
                                    <span className="font-semibold text-foreground">
                                        {formatTicketPrice(ticket.price ?? null)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-muted-foreground">No tickets submitted.</p>
                    )}
                </div>
            </div>

            <Dialog
                open={!!activeConsumable}
                onOpenChange={(open) => {
                    if (!open) setActiveConsumable(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Consumable ticket</DialogTitle>
                        <DialogDescription>
                            {activeConsumable
                                ? `${activeConsumable.category}: ${activeConsumable.description}`
                                : "Ticket consumption details."}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EventSubmissionTickets;

