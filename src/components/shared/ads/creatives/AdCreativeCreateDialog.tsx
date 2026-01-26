"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { createAdCreative } from "@/api/ads";
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

type AdCreativeCreateDialogProps = {
    open: boolean;
    placements: AdPlacement[];
    onOpenChange: (open: boolean) => void;
    onCreated: (creative: AdCreative) => void;
};

const AdCreativeCreateDialog = ({
    open,
    placements,
    onOpenChange,
    onCreated,
}: AdCreativeCreateDialogProps) => {
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

    useEffect(() => {
        if (!form.placementId && placements.length > 0) {
            const firstPlacement = placements[0]?.id ?? "";
            if (firstPlacement) {
                setForm((prev) => ({ ...prev, placementId: firstPlacement }));
            }
        }
    }, [form.placementId, placements]);

    const handleClose = () => onOpenChange(false);

    const handleSubmit = async () => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to create creatives.",
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
            const result = await createAdCreative({
                apiBaseUrl,
                accessToken: tokens.access,
                data: {
                    placementId: form.placementId,
                    title: form.title.trim() || undefined,
                    target_url: form.target_url.trim() || undefined,
                    starts_at: form.starts_at || undefined,
                    ends_at: form.ends_at || undefined,
                    is_active: form.is_active,
                    image: form.image,
                },
            });

            if (!result.ok || !result.body?.creative) {
                toast.error("Creative creation failed", {
                    description: result.body?.message ?? "Please review the form and retry.",
                });
                return;
            }

            onCreated(result.body.creative);
            toast.success("Creative created", {
                description: result.body?.message ?? "Ad creative added successfully.",
            });
            setForm({
                placementId: "",
                title: "",
                target_url: "",
                starts_at: "",
                ends_at: "",
                is_active: true,
                image: null,
                remove_image: false,
            });
            handleClose();
        } catch (error) {
            toast.error("Creative creation failed", {
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
                    <DialogTitle>New ad creative</DialogTitle>
                    <DialogDescription>
                        Upload a creative and configure its placement and schedule.
                    </DialogDescription>
                </DialogHeader>

                <AdCreativeForm
                    placements={placements}
                    form={form}
                    onChange={setForm}
                    disabled={isSubmitting}
                    currentImageUrl={null}
                />

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                        Create creative
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AdCreativeCreateDialog;
