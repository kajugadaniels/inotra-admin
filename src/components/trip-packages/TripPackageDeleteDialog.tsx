"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash2Icon, XIcon } from "lucide-react";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isLoading?: boolean;
    label?: string;
};

const TripPackageDeleteDialog = ({
    open,
    onOpenChange,
    onConfirm,
    isLoading = false,
    label = "package",
}: Props) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete package?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete <span className="font-semibold">{label}</span> and all its
                        activities and gallery images. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button
                        disabled={isLoading}
                        onClick={() => onOpenChange(false)}
                        variant="outline"
                        className="rounded-full text-xs h-11 uppercase font-bold"
                    >
                        <XIcon className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={onConfirm}
                        className="rounded-full text-xs h-11 uppercase font-bold"
                        variant="destructive"
                    >
                        <Trash2Icon className="mr-2 h-4 w-4" />
                        {isLoading ? "Deleting..." : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default TripPackageDeleteDialog;

