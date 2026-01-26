"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { getAdPlacement } from "@/api/ads";
import type { AdPlacement } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type AdPlacementDetailsDialogProps = {
    placementId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const formatDateTime = (value?: string | null) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const AdPlacementDetailsDialog = ({
    placementId,
    open,
    onOpenChange,
}: AdPlacementDetailsDialogProps) => {
    const [placement, setPlacement] = useState<AdPlacement | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        if (!open || !placementId) return;

        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to access placement details.",
            });
            return;
        }

        setIsLoading(true);
        getAdPlacement({
            apiBaseUrl,
            accessToken: tokens.access,
            placementId,
        })
            .then((result) => {
                if (!result.ok || !result.body) {
                    toast.error("Unable to load placement details", {
                        description: result.body?.message ?? "Please try again.",
                    });
                    return;
                }
                setPlacement(result.body);
            })
            .catch((error: Error) => {
                toast.error("Unable to load placement details", {
                    description: error.message ?? "Check API connectivity and try again.",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [apiBaseUrl, open, placementId]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Placement details</DialogTitle>
                    <DialogDescription>
                        Review placement metadata and availability settings.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Placement key
                        </p>
                        <p className="mt-2 text-sm font-semibold text-foreground">
                            {placement?.key ?? (isLoading ? "Loading..." : "--")}
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Title
                            </p>
                            <p className="mt-2 text-sm font-semibold text-foreground">
                                {placement?.title ?? (isLoading ? "Loading..." : "--")}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Status
                            </p>
                            <p className="mt-2 text-sm font-semibold text-foreground">
                                {placement
                                    ? placement.is_active
                                        ? "Active"
                                        : "Inactive"
                                    : isLoading
                                        ? "Loading..."
                                        : "--"}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Created
                            </p>
                            <p className="mt-2 text-sm font-semibold text-foreground">
                                {isLoading
                                    ? "Loading..."
                                    : formatDateTime(placement?.created_at)}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Updated
                            </p>
                            <p className="mt-2 text-sm font-semibold text-foreground">
                                {isLoading
                                    ? "Loading..."
                                    : formatDateTime(placement?.updated_at)}
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AdPlacementDetailsDialog;
