import { Loader2, Trash2, XIcon } from "lucide-react";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../../ui/button";

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
                <Button
                    className="rounded-full text-xs h-11"
                    onClick={() => onOpenChange(false)}
                >
                    <XIcon className="mr-2 h-4 w-4" />
                    Cancel
                </Button>
                <Button
                    className="rounded-full text-xs h-11"
                    variant="destructive"
                    onClick={onConfirm}
                    disabled={isLoading || disabled}
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Delete admin
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);

export default AdminDeleteDialog;
