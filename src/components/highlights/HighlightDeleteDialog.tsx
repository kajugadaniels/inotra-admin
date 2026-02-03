import { Loader2, Trash2, XIcon } from "lucide-react";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isLoading?: boolean;
    label?: string;
};

const HighlightDeleteDialog = ({ open, onOpenChange, onConfirm, isLoading, label }: Props) => (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="max-w-lg rounded-3xl border-border/60 bg-card/80 backdrop-blur-xl">
            <AlertDialogHeader>
                <AlertDialogTitle>Delete highlight?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will remove{" "}
                    <span className="font-semibold text-foreground">{label ?? "this highlight"}</span> and
                    all associated media.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
                <Button
                    variant="outline"
                    className="rounded-full text-xs h-11"
                    onClick={() => onOpenChange(false)}
                >
                    <XIcon className="mr-2 h-4 w-4" />
                    Cancel
                </Button>
                <Button
                    className="rounded-full text-xs h-11"
                    variant={"destructive"}
                    onClick={onConfirm}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Delete
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);

export default HighlightDeleteDialog;
