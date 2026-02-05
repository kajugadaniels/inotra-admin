"use client";

import { Input } from "@/components/ui/input";
import type { EventFormState } from "./EventForm";
import RichTextEditor from "@/components/shared/RichTextEditor";

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

            <div className="mt-2">
                <RichTextEditor
                    value={form.description || ""}
                    onChange={(html) => setForm({ ...form, description: html })}
                    placeholder="Describe the event experience..."
                />
            </div>
        </div>
    </div>
);

export default EventFormDetails;
