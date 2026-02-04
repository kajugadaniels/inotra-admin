"use client";

import { AlertTriangle, TrashIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isLoading?: boolean;
    userLabel?: string;
};

const CustomerRepDeleteDialog = ({ open, onOpenChange, onConfirm, isLoading = false, userLabel }: Props) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Delete customer rep?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. {userLabel ? `${userLabel} ` : ""}will lose access to the platform.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button
                        variant="outline"
                        disabled={isLoading} onClick={() => onOpenChange(false)}
                        className="rounded-full text-xs h-11 uppercase font-bold"
                    >
                        <XIcon className="h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={onConfirm}
                        variant="destructive"
                        className="rounded-full text-xs h-11 uppercase font-bold"
                    >
                        <TrashIcon className="h-4 w-4" />
                        Delete user
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CustomerRepDeleteDialog;
