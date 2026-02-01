"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { updateAdCreative } from "@/api/ads";
import type { AdCreative, AdPlacement } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import AdCreativeForm, {
    type AdCreativeFormState,
} from "@/components/shared/ads/creatives/AdCreativeForm";
import { UploadCloudIcon, XIcon } from "lucide-react";

type AdCreativeEditDialogProps = {
    creative: AdCreative | null;
    placements: AdPlacement[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdated: (creative: AdCreative) => void;
};

const AdCreativeEditDialog = ({
    creative,
    placements,
    open,
    onOpenChange,
    onUpdated,
}: AdCreativeEditDialogProps) => {
    const [form, setForm] = useState<AdCreativeFormState>({
        placementId: "",
        title: "",
        target_url: "",
        starts_at: "",
        ends_at: "",
        is_active: true,
        image: null,
        remove_image: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const toInputDateTime = (value?: string | null) => {
        if (!value) return "";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        const pad = (num: number) => String(num).padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
            date.getHours()
        )}:${pad(date.getMinutes())}`;
    };

    useEffect(() => {
        if (!creative) return;
        setForm({
            placementId: creative.placement_id ?? "",
            title: creative.title ?? "",
            target_url: creative.target_url ?? "",
            starts_at: toInputDateTime(creative.starts_at),
            ends_at: toInputDateTime(creative.ends_at),
            is_active: creative.is_active ?? true,
            image: null,
            remove_image: false,
        });
    }, [creative]);

    const handleClose = () => onOpenChange(false);

    const handleSubmit = async () => {
        if (!creative?.id) return;

        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to update creatives.",
            });
            return;
        }

        if (!form.placementId) {
            toast.error("Placement required", {
                description: "Select a placement for this creative.",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await updateAdCreative({
                apiBaseUrl,
                accessToken: tokens.access,
                creativeId: creative.id,
                data: {
                    placementId: form.placementId,
                    title: form.title.trim(),
                    target_url: form.target_url.trim(),
                    starts_at: form.starts_at || undefined,
                    ends_at: form.ends_at || undefined,
                    is_active: form.is_active,
                    image: form.image,
                    remove_image: form.remove_image,
                },
            });

            if (!result.ok || !result.body?.creative) {
                toast.error("Creative update failed", {
                    description: result.body?.message ?? "Please try again.",
                });
                return;
            }

            onUpdated(result.body.creative);
            toast.success("Creative updated", {
                description: result.body?.message ?? "Creative updated successfully.",
            });
            handleClose();
        } catch (error) {
            toast.error("Creative update failed", {
                description:
                    error instanceof Error ? error.message : "Check API connectivity and try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit creative</DialogTitle>
                    <DialogDescription>
                        Update the creative details, schedule, or placement.
                    </DialogDescription>
                </DialogHeader>

                <AdCreativeForm
                    placements={placements}
                    form={form}
                    onChange={setForm}
                    disabled={isSubmitting}
                    showRemoveImage
                    currentImageUrl={creative?.image_url ?? null}
                />

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full text-xs"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        <XIcon className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="h-11 rounded-full text-xs"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <UploadCloudIcon className="mr-2 h-4 w-4" />
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AdCreativeEditDialog;
