import { useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { deletePlace } from "@/api/places";
import type { PlaceListItem } from "@/api/types";
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

type ListingDeleteDialogProps = {
    listing: PlaceListItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted: (listingId: string) => void;
};

const ListingDeleteDialog = ({
    listing,
    open,
    onOpenChange,
    onDeleted,
}: ListingDeleteDialogProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const handleDelete = async () => {
        if (!listing?.id) return;

        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to delete listings.",
            });
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deletePlace({
                apiBaseUrl,
                accessToken: tokens.access,
                placeId: listing.id,
            });

            if (!result.ok) {
                toast.error("Listing deletion failed", {
                    description: result.body?.message ?? "Please try again.",
                });
                return;
            }

            onDeleted(listing.id);
            toast.success("Listing deleted", {
                description: result.body?.message ?? "Listing deleted successfully.",
            });
            onOpenChange(false);
        } catch (error) {
            toast.error("Listing deletion failed", {
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
                    <AlertDialogTitle>Delete listing?</AlertDialogTitle>
                    <AlertDialogDescription className="text-xs">
                        This will permanently remove the listing and its images from the platform.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting} className="text-xs">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="text-xs">
                        Delete listing
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ListingDeleteDialog;
