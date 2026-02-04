"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { deleteAdCreative } from "@/api/ads";
import type { AdCreative } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon, XIcon } from "lucide-react";

type AdCreativeDeleteDialogProps = {
    creative: AdCreative | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted: (creativeId: string) => void;
};

const AdCreativeDeleteDialog = ({
    creative,
    open,
    onOpenChange,
    onDeleted,
}: AdCreativeDeleteDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const handleDelete = async () => {
        if (!creative?.id) return;

        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to delete creatives.",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await deleteAdCreative({
                apiBaseUrl,
                accessToken: tokens.access,
                creativeId: creative.id,
            });

            if (!result.ok) {
                toast.error("Creative deletion failed", {
                    description: result.body?.message ?? "Please try again.",
                });
                return;
            }

            onDeleted(creative.id);
            toast.success("Creative deleted", {
                description: result.body?.message ?? "Creative removed successfully.",
            });
            onOpenChange(false);
        } catch (error) {
            toast.error("Creative deletion failed", {
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
                    <AlertDialogTitle>Delete creative?</AlertDialogTitle>
                    <AlertDialogDescription className="text-xs">
                        This will remove the creative and its uploaded image.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                        className="rounded-full text-xs h-11 uppercase font-bold"
                    >
                        <XIcon className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        className="rounded-full text-xs h-11 uppercase font-bold"
                        onClick={handleDelete}
                        disabled={isSubmitting}
                    >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete Creative
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AdCreativeDeleteDialog;
