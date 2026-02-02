"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Trash2, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isLoading?: boolean;
    userLabel?: string;
};

const UserDeleteDialog = ({
    open,
    onOpenChange,
    onConfirm,
    isLoading = false,
    userLabel,
}: Props) => {
    const [confirmText, setConfirmText] = useState("");
    const [acknowledged, setAcknowledged] = useState(false);

    const targetLabel = useMemo(() => userLabel?.trim() || "this user", [userLabel]);

    useEffect(() => {
        if (!open) {
            setConfirmText("");
            setAcknowledged(false);
        } else {
            // When opened, always reset to avoid a stale confirmed state
            setConfirmText("");
            setAcknowledged(false);
        }
    }, [open]);

    const canDelete =
        acknowledged && confirmText.trim().toUpperCase() === "DELETE" && !isLoading;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-lg rounded-3xl border-border/60 bg-background backdrop-blur-xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Permanently delete user?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="space-y-3">
                        <p>
                            You are about to permanently delete{" "}
                            <span className="font-semibold text-foreground">{targetLabel}</span>.
                        </p>

                        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                            <p className="font-semibold">This action is not reversible.</p>
                            <p className="mt-1 text-destructive/90">
                                The user will lose access immediately and any associated data may be removed.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Type DELETE to confirm
                            </p>
                            <Input
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder='Type "DELETE"'
                                className={cn(
                                    "h-11 rounded-2xl",
                                    confirmText.length > 0 &&
                                        confirmText.trim().toUpperCase() !== "DELETE" &&
                                        "border-destructive/50 focus-visible:ring-destructive/30"
                                )}
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>

                        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/60 bg-card/60 p-3">
                            <Checkbox
                                checked={acknowledged}
                                onCheckedChange={(v) => setAcknowledged(Boolean(v))}
                                disabled={isLoading}
                                className="mt-0.5"
                            />
                            <span className="text-sm text-muted-foreground">
                                I understand this action is permanent and cannot be undone.
                            </span>
                        </label>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="gap-2 sm:gap-0">
                    <Button
                        disabled={isLoading}
                        onClick={() => onOpenChange(false)}
                        variant="outline"
                        className="h-11 rounded-full text-xs"
                    >
                        <XIcon className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>

                    <Button
                        disabled={!canDelete}
                        onClick={onConfirm}
                        variant="destructive"
                        className="h-11 rounded-full text-xs"
                        title={
                            canDelete
                                ? "Delete user"
                                : 'To enable, type DELETE and confirm the checkbox.'
                        }
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isLoading ? "Deleting..." : "Delete user"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default UserDeleteDialog;
