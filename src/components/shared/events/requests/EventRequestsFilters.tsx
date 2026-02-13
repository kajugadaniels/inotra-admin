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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type EventRequestFiltersState = {
    search: string;
    status: "all" | "PENDING" | "APPROVED" | "REJECTED";
    city: string;
    country: string;
    ordering:
        | "created_at"
        | "updated_at"
        | "title"
        | "status"
        | "city"
        | "country"
        | "start_at"
        | "end_at";
    sort: "asc" | "desc";
};

export const defaultEventRequestFilters: EventRequestFiltersState = {
    search: "",
    status: "all",
    city: "",
    country: "",
    ordering: "created_at",
    sort: "desc",
};

type Props = {
    filters: EventRequestFiltersState;
    isLoading: boolean;
    onFiltersChange: (next: EventRequestFiltersState) => void;
    trigger?: ReactElement;
};

const EventRequestsFilters = ({ filters, isLoading, onFiltersChange, trigger }: Props) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [draft, setDraft] = useState<EventRequestFiltersState>(filters);

    const handleOpenChange = (open: boolean) => {
        setDialogOpen(open);
        if (open) setDraft(filters);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

            <DialogContent className="max-w-xl rounded-3xl border-border/60 bg-background backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle>Filter event submissions</DialogTitle>
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
                                    ordering: value as EventRequestFiltersState["ordering"],
                                })
                            }
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created_at">Created date</SelectItem>
                                <SelectItem value="updated_at">Updated date</SelectItem>
                                <SelectItem value="title">Event title</SelectItem>
                                <SelectItem value="status">Status</SelectItem>
                                <SelectItem value="start_at">Start date</SelectItem>
                                <SelectItem value="end_at">End date</SelectItem>
                                <SelectItem value="city">City</SelectItem>
                                <SelectItem value="country">Country</SelectItem>
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
                                <SelectValue placeholder="Direction" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Newest first</SelectItem>
                                <SelectItem value="asc">Oldest first</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Submission status
                        </label>
                        <Select
                            value={draft.status}
                            onValueChange={(value) =>
                                setDraft({
                                    ...draft,
                                    status:
                                        value === "PENDING" || value === "APPROVED" || value === "REJECTED"
                                            ? value
                                            : "all",
                                })
                            }
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="APPROVED">Approved</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                City
                            </label>
                            <Input
                                value={draft.city}
                                onChange={(event) => setDraft({ ...draft, city: event.target.value })}
                                className="admin-field mt-2 h-11 rounded-2xl border-border/60 bg-background/60 text-xs"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Country
                            </label>
                            <Input
                                value={draft.country}
                                onChange={(event) => setDraft({ ...draft, country: event.target.value })}
                                className="admin-field mt-2 h-11 rounded-2xl border-border/60 bg-background/60 text-xs"
                            />
                        </div>
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

export default EventRequestsFilters;

