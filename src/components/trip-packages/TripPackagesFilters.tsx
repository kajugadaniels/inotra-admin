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

export type TripPackagesFiltersState = {
    search: string;
    ordering: "created_at" | "title" | "duration_days";
    sort: "asc" | "desc";
    isActive: "all" | "true" | "false";
};

type Props = {
    filters: TripPackagesFiltersState;
    isLoading: boolean;
    onFiltersChange: (next: TripPackagesFiltersState) => void;
    trigger?: ReactElement;
};

const TripPackagesFilters = ({ filters, isLoading, onFiltersChange, trigger }: Props) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [draft, setDraft] = useState<TripPackagesFiltersState>(filters);

    const handleOpenChange = (open: boolean) => {
        setDialogOpen(open);
        if (open) setDraft(filters);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

            <DialogContent className="max-w-xl rounded-3xl border-border/60 bg-background backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle>Filter packages</DialogTitle>
                    <DialogDescription className="text-xs">
                        Adjust the filters below and click apply.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Sort by
                        </label>
                        <Select
                            value={draft.ordering}
                            onValueChange={(value) =>
                                setDraft({
                                    ...draft,
                                    ordering: value as TripPackagesFiltersState["ordering"],
                                })
                            }
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created_at">Created date</SelectItem>
                                <SelectItem value="title">Title</SelectItem>
                                <SelectItem value="duration_days">Duration</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Sort direction
                        </label>
                        <Select
                            value={draft.sort}
                            onValueChange={(value) =>
                                setDraft({
                                    ...draft,
                                    sort: value === "asc" ? "asc" : "desc",
                                })
                            }
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Sort direction" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Newest first</SelectItem>
                                <SelectItem value="asc">Oldest first</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Status
                        </label>
                        <Select
                            value={draft.isActive}
                            onValueChange={(value) =>
                                setDraft({
                                    ...draft,
                                    isActive: value === "true" || value === "false" ? value : "all",
                                })
                            }
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
                    >
                        <XIcon className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="h-11 rounded-full text-xs uppercase font-bold"
                        onClick={() => {
                            onFiltersChange(draft);
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

export default TripPackagesFilters;

