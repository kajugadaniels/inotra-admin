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

export type EventFiltersState = {
    search: string;
    ordering: "start_at" | "created_at" | "title" | "city" | "country";
    sort: "asc" | "desc";
    isActive: "all" | "true" | "false";
    isVerified: "all" | "true" | "false";
    city: string;
    country: string;
    startFrom?: string | null;
    startTo?: string | null;
};

export const defaultEventFilters: EventFiltersState = {
    search: "",
    ordering: "start_at",
    sort: "desc",
    isActive: "all",
    isVerified: "all",
    city: "",
    country: "",
    startFrom: null,
    startTo: null,
};

type Props = {
    filters: EventFiltersState;
    isLoading: boolean;
    onFiltersChange: (next: EventFiltersState) => void;
    trigger?: ReactElement;
};

const EventFilters = ({ filters, isLoading, onFiltersChange, trigger }: Props) => {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<EventFiltersState>(filters);

    const handleOpenChange = (value: boolean) => {
        setOpen(value);
        if (value) setDraft(filters);
    };

    const apply = () => {
        onFiltersChange(draft);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
            <DialogContent className="max-w-3xl rounded-3xl border-border/60 bg-background/80 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle>Filter events</DialogTitle>
                    <DialogDescription>
                        Adjust filters to narrow down events. Sorting defaults to latest start date.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Search
                        </label>
                        <Input
                            value={draft.search}
                            onChange={(e) => setDraft({ ...draft, search: e.target.value })}
                            placeholder="Search title, venue, organizer..."
                            className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Order by
                        </label>
                        <Select
                            value={draft.ordering}
                            onValueChange={(v) =>
                                setDraft({
                                    ...draft,
                                    ordering: v as EventFiltersState["ordering"],
                                })
                            }
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-sm">
                                <SelectValue placeholder="start_at" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="start_at">Start date</SelectItem>
                                <SelectItem value="created_at">Created at</SelectItem>
                                <SelectItem value="title">Title</SelectItem>
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
                            onValueChange={(v) => setDraft({ ...draft, sort: v === "asc" ? "asc" : "desc" })}
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-sm">
                                <SelectValue placeholder="desc" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Desc</SelectItem>
                                <SelectItem value="asc">Asc</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Active
                        </label>
                        <Select
                            value={draft.isActive}
                            onValueChange={(v) =>
                                setDraft({
                                    ...draft,
                                    isActive: v === "true" || v === "false" ? v : "all",
                                })
                            }
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-sm">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Verified
                        </label>
                        <Select
                            value={draft.isVerified}
                            onValueChange={(v) =>
                                setDraft({
                                    ...draft,
                                    isVerified: v === "true" || v === "false" ? v : "all",
                                })
                            }
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-sm">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="true">Verified</SelectItem>
                                <SelectItem value="false">Unverified</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            City
                        </label>
                        <Input
                            value={draft.city}
                            onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                            placeholder="City"
                            className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Country
                        </label>
                        <Input
                            value={draft.country}
                            onChange={(e) => setDraft({ ...draft, country: e.target.value })}
                            placeholder="Country"
                            className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Start from
                        </label>
                        <Input
                            type="date"
                            className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60 text-sm"
                            value={draft.startFrom ?? ""}
                            onChange={(e) => setDraft({ ...draft, startFrom: e.target.value || null })}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Start to
                        </label>
                        <Input
                            type="date"
                            className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60 text-sm"
                            value={draft.startTo ?? ""}
                            onChange={(e) => setDraft({ ...draft, startTo: e.target.value || null })}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full text-xs uppercase font-bold"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                    >
                        <XIcon className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="h-11 rounded-full text-xs uppercase font-bold"
                        onClick={apply}
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

export default EventFilters;
