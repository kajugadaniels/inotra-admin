import { Loader2, Trash2 } from "lucide-react";

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

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isLoading?: boolean;
    userLabel?: string;
    disabled?: boolean;
};

const AdminDeleteDialog = ({ open, onOpenChange, onConfirm, isLoading, userLabel, disabled }: Props) => (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="max-w-lg rounded-3xl border-border/60 bg-card/80 backdrop-blur-xl">
            <AlertDialogHeader>
                <AlertDialogTitle>Delete admin account?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. The admin{" "}
                    <span className="font-semibold text-foreground">{userLabel ?? "user"}</span> will
                    lose access immediately.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                <AlertDialogAction
                    className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={onConfirm}
                    disabled={isLoading || disabled}
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Delete admin
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);

export default AdminDeleteDialog;
