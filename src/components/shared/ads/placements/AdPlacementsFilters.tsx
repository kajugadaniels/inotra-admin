"use client";

import { Filter, XIcon } from "lucide-react";
import { useState, type ReactElement } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type AdPlacementsFiltersState = {
    search: string;
    sort: "asc" | "desc";
    isActive: "all" | "true" | "false";
};

export const defaultAdPlacementsFilters: AdPlacementsFiltersState = {
    search: "",
    sort: "desc",
    isActive: "all",
};

type AdPlacementsFiltersProps = {
    filters: AdPlacementsFiltersState;
    isLoading: boolean;
    onFiltersChange: (next: AdPlacementsFiltersState) => void;
    trigger?: ReactElement;
};

const AdPlacementsFilters = ({ filters, isLoading, onFiltersChange, trigger }: AdPlacementsFiltersProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [draftFilters, setDraftFilters] = useState<AdPlacementsFiltersState>(filters);

    const handleOpenChange = (open: boolean) => {
        setDialogOpen(open);
        if (open) setDraftFilters(filters);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

            <DialogContent className="max-w-xl rounded-3xl border-border/60 bg-background backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle>Filter placements</DialogTitle>
                    <DialogDescription>
                        Adjust the filters below and click apply.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Sort by
                        </label>
                        <Select
                            value={draftFilters.sort}
                            onValueChange={(value) =>
                                setDraftFilters({
                                    ...draftFilters,
                                    sort: value === "asc" ? "asc" : "desc",
                                })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Newest first</SelectItem>
                                <SelectItem value="asc">Oldest first</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Status
                        </label>
                        <Select
                            value={draftFilters.isActive}
                            onValueChange={(value) =>
                                setDraftFilters({
                                    ...draftFilters,
                                    isActive:
                                        value === "true" || value === "false" ? value : "all",
                                })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All status</SelectItem>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full text-xs mr-5 uppercase font-bold"
                        onClick={() => setDialogOpen(false)}
                        disabled={isLoading}
                    >
                        <XIcon className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="h-11 rounded-full text-xs uppercase font-bold"
                        onClick={() => {
                            onFiltersChange(draftFilters);
                            setDialogOpen(false);
                        }}
                        disabled={isLoading}
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Apply filters
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AdPlacementsFilters;
