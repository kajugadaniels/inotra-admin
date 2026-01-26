"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { createAdPlacement } from "@/api/ads";
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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type AdPlacementCreateDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: (placement: AdPlacement) => void;
};

const AdPlacementCreateDialog = ({
    open,
    onOpenChange,
    onCreated,
}: AdPlacementCreateDialogProps) => {
    const [form, setForm] = useState({ key: "", title: "", is_active: true });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const handleClose = () => onOpenChange(false);

    const handleSubmit = async () => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to create placements.",
            });
            return;
        }

        const key = form.key.trim();
        if (!key) {
            toast.error("Placement key required", {
                description: "Provide a unique key for the placement.",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createAdPlacement({
                apiBaseUrl,
                accessToken: tokens.access,
                data: {
                    key,
                    title: form.title.trim() || undefined,
                    is_active: form.is_active,
                },
            });

            if (!result.ok || !result.body?.placement) {
                toast.error("Placement creation failed", {
                    description: result.body?.message ?? "Please review the form and retry.",
                });
                return;
            }

            onCreated(result.body.placement);
            toast.success("Placement created", {
                description: result.body?.message ?? "Ad placement added successfully.",
            });
            setForm({ key: "", title: "", is_active: true });
            handleClose();
        } catch (error) {
            toast.error("Placement creation failed", {
                description:
                    error instanceof Error ? error.message : "Check API connectivity and try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>New ad placement</DialogTitle>
                    <DialogDescription>
                        Create a new placement key for ad inventory.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Placement key
                        </label>
                        <Input
                            value={form.key}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, key: event.target.value }))
                            }
                            placeholder="HOME_FEED_TOP"
                            className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        />
                    </div>
                    <div>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Title
                        </label>
                        <Input
                            value={form.title}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, title: event.target.value }))
                            }
                            placeholder="Homepage hero banner"
                            className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        />
                    </div>
                    <div>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Status
                        </label>
                        <Select
                            value={form.is_active ? "true" : "false"}
                            onValueChange={(value) =>
                                setForm((prev) => ({ ...prev, is_active: value === "true" }))
                            }
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        className="h-11 rounded-full"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="h-11 rounded-full"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        Create placement
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AdPlacementCreateDialog;
