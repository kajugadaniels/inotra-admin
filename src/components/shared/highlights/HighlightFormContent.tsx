"use client";

import { Textarea } from "@/components/ui/textarea";
import type { HighlightFormState } from "./HighlightForm";

type Props = {
    form: HighlightFormState;
    setForm: React.Dispatch<React.SetStateAction<HighlightFormState>>;
};

const HighlightFormContent = ({ form, setForm }: Props) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Caption (optional)
                </label>
                <Textarea
                    value={form.caption}
                    onChange={(e) => setForm({ ...form, caption: e.target.value })}
                    placeholder="Say something about this highlight..."
                    className="mt-2 min-h-[140px]"
                />
            </div>
        </div>
    );
};

export default HighlightFormContent;
