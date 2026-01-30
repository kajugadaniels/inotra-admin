"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { getAdCreative } from "@/api/ads";
import type { AdCreative } from "@/api/types";
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
import Image from "next/image";

type AdCreativeDetailsDialogProps = {
    creativeId: string | null;
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

const AdCreativeDetailsDialog = ({
    creativeId,
    open,
    onOpenChange,
}: AdCreativeDetailsDialogProps) => {
    const [creative, setCreative] = useState<AdCreative | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const loadCreative = async () => {
        if (!creativeId) return;
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to access creative details.",
            });
            return;
        }

        setIsLoading(true);
        try {
            const result = await getAdCreative({
                apiBaseUrl,
                accessToken: tokens.access,
                creativeId,
            });

            if (!result.ok || !result.body) {
                toast.error("Unable to load creative details", {
                    description: result.body?.message ?? "Please try again.",
                });
                return;
            }

            setCreative(result.body);
        } catch (error) {
            toast.error("Unable to load creative details", {
                description:
                    error instanceof Error
                        ? error.message
                        : "Check API connectivity and try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            void loadCreative();
        }
    }, [open, creativeId]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Creative details</DialogTitle>
                    <DialogDescription>
                        Review creative metadata, placement, and schedule.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
                        {creative?.image_url ? (
                            <Image
                                src={creative.image_url}
                                alt={creative.title ?? "Ad creative"}
                                className="h-56 w-full object-cover"
                                width={800}
                                height={300}
                                priority
                            />
                        ) : (
                            <div className="flex h-56 items-center justify-center text-xs text-muted-foreground">
                                {isLoading ? "Loading image..." : "No image uploaded"}
                            </div>
                        )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Title
                            </p>
                            <p className="mt-2 text-xs font-semibold text-foreground">
                                {creative?.title ?? (isLoading ? "Loading..." : "--")}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Placement
                            </p>
                            <p className="mt-2 text-xs font-semibold text-foreground">
                                {creative?.placement_key ?? (isLoading ? "Loading..." : "--")}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Starts at
                            </p>
                            <p className="mt-2 text-xs font-semibold text-foreground">
                                {isLoading ? "Loading..." : formatDateTime(creative?.starts_at)}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Ends at
                            </p>
                            <p className="mt-2 text-xs font-semibold text-foreground">
                                {isLoading ? "Loading..." : formatDateTime(creative?.ends_at)}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Status
                            </p>
                            <p className="mt-2 text-xs font-semibold text-foreground">
                                {creative
                                    ? creative.is_active
                                        ? "Active"
                                        : "Inactive"
                                    : isLoading
                                        ? "Loading..."
                                        : "--"}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Target URL
                            </p>
                            <p className="mt-2 text-xs font-semibold text-foreground">
                                {creative?.target_url ?? (isLoading ? "Loading..." : "--")}
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-xs">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AdCreativeDetailsDialog;
