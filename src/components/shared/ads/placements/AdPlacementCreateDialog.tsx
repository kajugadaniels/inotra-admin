"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { createAdPlacement } from "@/api/ads";
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

type AdPlacementCreateDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: (placement: AdPlacement) => void;
};

const AdPlacementCreateDialog = ({
    open,
    onOpenChange,
    onCreated,
}: AdPlacementCreateDialogProps) => {
    const [form, setForm] = useState<AdPlacementFormState>({
        key: "",
        title: "",
        is_active: true,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const handleClose = () => onOpenChange(false);

    const handleSubmit = async () => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to create placements.",
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
            const result = await createAdPlacement({
                apiBaseUrl,
                accessToken: tokens.access,
                data: {
                    key,
                    title: form.title.trim() || undefined,
                    is_active: form.is_active,
                },
            });

            if (!result.ok || !result.body?.placement) {
                toast.error("Placement creation failed", {
                    description: result.body?.message ?? "Please review the form and retry.",
                });
                return;
            }

            onCreated(result.body.placement);
            toast.success("Placement created", {
                description: result.body?.message ?? "Ad placement added successfully.",
            });
            setForm({ key: "", title: "", is_active: true });
            handleClose();
        } catch (error) {
            toast.error("Placement creation failed", {
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
                    <DialogTitle>New ad placement</DialogTitle>
                    <DialogDescription className="text-xs">
                        Create a new placement key for ad inventory.
                    </DialogDescription>
                </DialogHeader>

                <AdPlacementForm form={form} onChange={setForm} disabled={isSubmitting} />

                <DialogFooter>
                    <Button
                        type="button"
                        className="h-11 rounded-full text-xs uppercase font-bold"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="h-11 rounded-full text-xs uppercase font-bold"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        Create placement
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AdPlacementCreateDialog;
