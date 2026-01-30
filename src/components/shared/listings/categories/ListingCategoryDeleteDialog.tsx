import { useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { deletePlaceCategory } from "@/api/places";
import type { PlaceCategory } from "@/api/types";
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

type ListingCategoryDeleteDialogProps = {
    category: PlaceCategory | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted: (categoryId: string) => void;
};

const ListingCategoryDeleteDialog = ({
    category,
    open,
    onOpenChange,
    onDeleted,
}: ListingCategoryDeleteDialogProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const handleDelete = async () => {
        if (!category?.id) return;

        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to delete listing categories.",
            });
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deletePlaceCategory({
                apiBaseUrl,
                accessToken: tokens.access,
                categoryId: category.id,
            });

            if (!result.ok) {
                toast.error("Listing category deletion failed", {
                    description: result.body?.message ?? "Please try again.",
                });
                return;
            }

            onDeleted(category.id);
            toast.success("Listing category deleted", {
                description: result.body?.message ?? "Listing category deleted successfully.",
            });
            onOpenChange(false);
        } catch (error) {
            toast.error("Listing category deletion failed", {
                description:
                    error instanceof Error
                        ? error.message
                        : "Check API connectivity and try again.",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete listing category?</AlertDialogTitle>
                    <AlertDialogDescription className="text-xs">
                        This will remove the category from the platform. Listings attached to it will keep their records but lose the category association.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting} className="text-xs">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="text-xs">
                        Delete category
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ListingCategoryDeleteDialog;
