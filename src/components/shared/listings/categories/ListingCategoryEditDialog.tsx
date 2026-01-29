import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { updatePlaceCategory } from "@/api/places";
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

type ListingCategoryEditDialogProps = {
    category: PlaceCategory | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdated: (category: PlaceCategory) => void;
};

const ListingCategoryEditDialog = ({
    category,
    open,
    onOpenChange,
    onUpdated,
}: ListingCategoryEditDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState<ListingCategoryFormState>({
        name: "",
        icon: "",
        is_active: true,
    });

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        if (!category) return;
        setForm({
            name: category.name ?? "",
            icon: category.icon ?? "",
            is_active: category.is_active ?? true,
        });
    }, [category]);

    const handleClose = () => {
        if (!isSubmitting) {
            onOpenChange(false);
        }
    };

    const handleUpdate = async () => {
        if (!category?.id) return;

        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to update listing categories.",
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
            const result = await updatePlaceCategory({
                apiBaseUrl,
                accessToken: tokens.access,
                categoryId: category.id,
                data: {
                    name: form.name.trim(),
                    icon: form.icon.trim() || undefined,
                    is_active: form.is_active,
                },
            });

            if (!result.ok || !result.body?.category) {
                toast.error("Listing category update failed", {
                    description: result.body?.message ?? "Please try again.",
                });
                return;
            }

            onUpdated(result.body.category);
            toast.success("Listing category updated", {
                description: result.body?.message ?? "Listing category updated successfully.",
            });
            onOpenChange(false);
        } catch (error) {
            toast.error("Listing category update failed", {
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
                    <DialogTitle>Edit listing category</DialogTitle>
                    <DialogDescription>
                        Update the listing category details and visibility.
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
                        onClick={handleUpdate}
                        disabled={isSubmitting}
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ListingCategoryEditDialog;
