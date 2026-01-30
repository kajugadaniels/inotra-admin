import { useEffect, useMemo, useState } from "react";

import type { AdPlacement } from "@/api/types";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

export type AdCreativeFormState = {
    placementId: string;
    title: string;
    target_url: string;
    starts_at: string;
    ends_at: string;
    is_active: boolean;
    image: File | null;
    remove_image: boolean;
};

type AdCreativeFormProps = {
    placements: AdPlacement[];
    form: AdCreativeFormState;
    onChange: (next: AdCreativeFormState) => void;
    disabled?: boolean;
    showRemoveImage?: boolean;
    currentImageUrl?: string | null;
};

const AdCreativeForm = ({
    placements,
    form,
    onChange,
    disabled = false,
    showRemoveImage = false,
    currentImageUrl,
}: AdCreativeFormProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (form.image) {
            const nextUrl = URL.createObjectURL(form.image);
            setPreviewUrl(nextUrl);
            return () => URL.revokeObjectURL(nextUrl);
        }
        setPreviewUrl(null);
        return undefined;
    }, [form.image]);

    const placementOptions = useMemo(
        () =>
            placements.map((placement) => ({
                value: placement.id ?? "",
                label: placement.title || placement.key || "Untitled placement",
            })),
        [placements]
    );

    return (
        <div className="space-y-4">
            <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Placement (required)
                </label>
                <Select
                    value={form.placementId}
                    onValueChange={(value) =>
                        onChange({
                            ...form,
                            placementId: value,
                        })
                    }
                    disabled={disabled}
                >
                    <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60">
                        <SelectValue placeholder="Select placement" />
                    </SelectTrigger>
                    <SelectContent>
                        {placementOptions.map((placement) => (
                            <SelectItem key={placement.value} value={placement.value}>
                                {placement.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Title (optional)
                </label>
                <Input
                    value={form.title}
                    onChange={(event) => onChange({ ...form, title: event.target.value })}
                    placeholder="Launch campaign banner"
                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>

            <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Target URL (optional)
                </label>
                <Input
                    value={form.target_url}
                    onChange={(event) =>
                        onChange({ ...form, target_url: event.target.value })
                    }
                    placeholder="https://example.com"
                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Starts at (optional)
                    </label>
                    <Input
                        type="datetime-local"
                        value={form.starts_at}
                        onChange={(event) =>
                            onChange({ ...form, starts_at: event.target.value })
                        }
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                </div>
                <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Ends at (optional)
                    </label>
                    <Input
                        type="datetime-local"
                        value={form.ends_at}
                        onChange={(event) =>
                            onChange({ ...form, ends_at: event.target.value })
                        }
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Creative image (optional)
                </label>
                <Input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                        onChange({
                            ...form,
                            image: event.target.files?.[0] ?? null,
                            remove_image: false,
                        })
                    }
                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                    disabled={disabled}
                />
                {previewUrl || currentImageUrl ? (
                    <div className="mt-3 overflow-hidden rounded-2xl border border-border/60">
                        <Image
                            src={previewUrl ?? currentImageUrl ?? ""}
                            alt="Preview"
                            className="h-40 w-full object-cover"
                            width={800}
                            height={200}
                        />
                    </div>
                ) : null}
            </div>

            {showRemoveImage ? (
                <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                    <div>
                        <p className="text-xs font-semibold text-foreground">
                            Remove image (optional)
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Clear the current creative image.
                        </p>
                    </div>
                    <Switch
                        checked={form.remove_image}
                        onCheckedChange={(checked) =>
                            onChange({
                                ...form,
                                remove_image: checked,
                                image: checked ? null : form.image,
                            })
                        }
                        disabled={disabled}
                    />
                </div>
            ) : null}

            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                <div>
                    <p className="text-xs font-semibold text-foreground">
                        Active status (optional)
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Toggle whether this creative is active.
                    </p>
                </div>
                <Switch
                    checked={form.is_active}
                    onCheckedChange={(checked) => onChange({ ...form, is_active: checked })}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

export default AdCreativeForm;
