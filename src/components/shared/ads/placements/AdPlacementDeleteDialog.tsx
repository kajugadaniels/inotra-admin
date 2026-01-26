"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { deleteAdPlacement } from "@/api/ads";
import type { AdPlacement } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AdPlacementDeleteDialogProps = {
    placement: AdPlacement | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted: (placementId: string) => void;
};

const AdPlacementDeleteDialog = ({
    placement,
    open,
    onOpenChange,
    onDeleted,
}: AdPlacementDeleteDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const handleDelete = async () => {
        if (!placement?.id) return;

        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to delete placements.",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await deleteAdPlacement({
                apiBaseUrl,
                accessToken: tokens.access,
                placementId: placement.id,
            });

            if (!result.ok) {
                toast.error("Placement deletion failed", {
                    description: result.body?.message ?? "Please try again.",
                });
                return;
            }

            onDeleted(placement.id);
            toast.success("Placement deleted", {
                description: result.body?.message ?? "Placement removed successfully.",
            });
            onOpenChange(false);
        } catch (error) {
            toast.error("Placement deletion failed", {
                description:
                    error instanceof Error ? error.message : "Check API connectivity and try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete placement?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will remove the placement key. Existing creatives remain but will no
                        longer reference this placement.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isSubmitting}>
                        Delete placement
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AdPlacementDeleteDialog;
