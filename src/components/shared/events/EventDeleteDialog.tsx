import { Loader2, Trash2 } from "lucide-react";

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
    eventLabel?: string;
};

const EventDeleteDialog = ({ open, onOpenChange, onConfirm, isLoading, eventLabel }: Props) => (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="max-w-lg rounded-3xl border-border/60 bg-card/80 backdrop-blur-xl">
            <AlertDialogHeader>
                <AlertDialogTitle>Delete event?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently remove{" "}
                    <span className="font-semibold text-foreground">{eventLabel ?? "this event"}</span>.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
                <Button
                    variant="outline"
                    className="rounded-full text-xs uppercase font-bold"
                    onClick={() => onOpenChange(false)}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    className="rounded-full text-xs h-11 uppercase font-bold"
                    onClick={onConfirm}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Delete event
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);

export default EventDeleteDialog;
