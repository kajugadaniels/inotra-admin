"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { updateAdPlacement } from "@/api/ads";
import type { AdPlacement } from "@/api/types";
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
import AdPlacementForm, {
    type AdPlacementFormState,
} from "@/components/shared/ads/placements/AdPlacementForm";
import { UploadCloudIcon, XIcon } from "lucide-react";

type AdPlacementEditDialogProps = {
    placement: AdPlacement | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdated: (placement: AdPlacement) => void;
};

const AdPlacementEditDialog = ({
    placement,
    open,
    onOpenChange,
    onUpdated,
}: AdPlacementEditDialogProps) => {
    const [form, setForm] = useState<AdPlacementFormState>({
        key: "",
        title: "",
        is_active: true,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        if (placement) {
            setForm({
                key: placement.key ?? "",
                title: placement.title ?? "",
                is_active: placement.is_active ?? true,
            });
        }
    }, [placement]);

    const handleClose = () => onOpenChange(false);

    const handleSubmit = async () => {
        if (!placement?.id) return;

        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to update placements.",
            });
            return;
        }

        const key = form.key.trim();
        if (!key) {
            toast.error("Placement key required", {
                description: "Provide a unique key for the placement.",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await updateAdPlacement({
                apiBaseUrl,
                accessToken: tokens.access,
                placementId: placement.id,
                data: {
                    key,
                    title: form.title.trim() || undefined,
                    is_active: form.is_active,
                },
            });

            if (!result.ok || !result.body?.placement) {
                toast.error("Placement update failed", {
                    description: result.body?.message ?? "Please try again.",
                });
                return;
            }

            onUpdated(result.body.placement);
            toast.success("Placement updated", {
                description: result.body?.message ?? "Placement updated successfully.",
            });
            handleClose();
        } catch (error) {
            toast.error("Placement update failed", {
                description:
                    error instanceof Error ? error.message : "Check API connectivity and try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Edit placement</DialogTitle>
                    <DialogDescription className="text-xs">
                        Update placement metadata and availability.
                    </DialogDescription>
                </DialogHeader>

                <AdPlacementForm form={form} onChange={setForm} disabled={isSubmitting} />

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full text-xs uppercase font-bold"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        <XIcon className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="h-11 rounded-full text-xs uppercase font-bold"
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

export default AdPlacementEditDialog;
