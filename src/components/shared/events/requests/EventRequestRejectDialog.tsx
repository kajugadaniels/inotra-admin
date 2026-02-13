"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type Props = {
    open: boolean;
    isLoading: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (reason: string) => void;
};

const EventRequestRejectDialog = ({ open, isLoading, onOpenChange, onConfirm }: Props) => {
    const [reason, setReason] = useState("");

    const handleClose = (next: boolean) => {
        if (!next) setReason("");
        onOpenChange(next);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg rounded-3xl border-border/60 bg-background">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Reject event submission
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Provide a clear rejection reason. This will be shared with the submitter.
                    </DialogDescription>
                </DialogHeader>

                <Textarea
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Share the specific reason for rejection..."
                    className="min-h-[120px] rounded-2xl border-border/60 bg-background/60 text-sm"
                    disabled={isLoading}
                />

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full text-xs mr-5 uppercase font-bold"
                        onClick={() => handleClose(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        className="h-11 rounded-full text-xs uppercase font-bold"
                        onClick={() => onConfirm(reason)}
                        disabled={isLoading || reason.trim().length === 0}
                    >
                        Reject submission
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EventRequestRejectDialog;

