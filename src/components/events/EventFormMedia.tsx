"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { EventFormState } from "./EventForm";

type Props = {
    form: EventFormState;
    setForm: (next: EventFormState) => void;
};

const EventFormMedia = ({ form, setForm }: Props) => {
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setForm({ ...form, banner: file, remove_banner: false });
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Banner image (optional)
                </label>
                <Input type="file" accept="image/*" className="mt-2" onChange={handleFile} />
                {form.banner ? (
                    <p className="mt-2 text-xs text-muted-foreground">{form.banner.name}</p>
                ) : null}
            </div>
            <div className="flex items-center gap-2">
                <Switch
                    checked={!!form.remove_banner}
                    onCheckedChange={(val) => setForm({ ...form, remove_banner: val, banner: null })}
                />
                <span className="text-sm text-muted-foreground">Remove existing banner</span>
            </div>
        </div>
    );
};

export default EventFormMedia;
