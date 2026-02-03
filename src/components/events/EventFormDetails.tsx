"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { EventFormState } from "./EventForm";

type Props = {
    form: EventFormState;
    setForm: (next: EventFormState) => void;
};

const EventFormDetails = ({ form, setForm }: Props) => (
    <div className="space-y-4">
        <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Title (required)
            </label>
            <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Summer Music Festival"
            />
        </div>
        <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Description (optional)
            </label>
            <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the event experience..."
                className="min-h-[140px]"
            />
        </div>
    </div>
);

export default EventFormDetails;
