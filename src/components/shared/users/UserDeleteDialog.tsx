"use client";

import { AlertTriangle } from "lucide-react";

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

const UserDeleteDialog = ({ open, onOpenChange, onConfirm, isLoading = false, userLabel }: Props) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Delete user?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. {userLabel ? `${userLabel} ` : ""}will lose access to the platform.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button
                        disabled={isLoading}
                        onClick={() => onOpenChange(false)}
                        variant="outline"
                        className="h-11 rounded-full text-xs"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={onConfirm}
                        variant="destructive"
                        className="h-11 rounded-full text-xs"
                    >
                        Delete User
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default UserDeleteDialog;
