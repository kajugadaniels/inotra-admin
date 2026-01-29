import { useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { createPlaceCategory } from "@/api/places";
import type { PlaceCategory } from "@/api/types";
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
import ListingCategoryForm, {
    type ListingCategoryFormState,
} from "./ListingCategoryForm";

type ListingCategoryCreateDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: (category: PlaceCategory) => void;
};

const ListingCategoryCreateDialog = ({
    open,
    onOpenChange,
    onCreated,
}: ListingCategoryCreateDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState<ListingCategoryFormState>({
        name: "",
        icon: "",
        is_active: true,
    });

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const handleClose = () => {
        if (!isSubmitting) {
            onOpenChange(false);
        }
    };

    const handleCreate = async () => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to create listing categories.",
            });
            return;
        }

        if (!form.name.trim()) {
            toast.error("Listing category name required", {
                description: "Provide a name for the listing category.",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createPlaceCategory({
                apiBaseUrl,
                accessToken: tokens.access,
                data: {
                    name: form.name.trim(),
                    icon: form.icon.trim() || undefined,
                    is_active: form.is_active,
                },
            });

            if (!result.ok || !result.body?.category) {
                toast.error("Listing category creation failed", {
                    description: result.body?.message ?? "Please review the form and retry.",
                });
                return;
            }

            onCreated(result.body.category);
            toast.success("Listing category created", {
                description: result.body?.message ?? "Listing category added successfully.",
            });
            setForm({ name: "", icon: "", is_active: true });
            onOpenChange(false);
        } catch (error) {
            toast.error("Listing category creation failed", {
                description:
                    error instanceof Error
                        ? error.message
                        : "Check API connectivity and try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>New listing category</DialogTitle>
                    <DialogDescription>
                        Create a category to organize listings across the platform.
                    </DialogDescription>
                </DialogHeader>

                <ListingCategoryForm form={form} onChange={setForm} disabled={isSubmitting} />

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="h-11 rounded-full"
                        onClick={handleCreate}
                        disabled={isSubmitting}
                    >
                        Create category
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ListingCategoryCreateDialog;
