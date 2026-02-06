"use client";

import { useEffect, useMemo, useState, type ReactElement } from "react";
import { Filter, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
    defaultHighlightEngagementFilters,
    type HighlightEngagementFiltersState,
} from "./types";

type Props = {
    filters: HighlightEngagementFiltersState;
    isLoading: boolean;
    onFiltersChange: (next: HighlightEngagementFiltersState) => void;
    onApply: () => void;
    onReset: () => void;
    trigger: ReactElement;
};

const HighlightEngagementFilters = ({
    filters,
    isLoading,
    onFiltersChange,
    onApply,
    onReset,
    trigger,
}: Props) => {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<HighlightEngagementFiltersState>(filters);

    useEffect(() => setDraft(filters), [filters]);

    const canReset = useMemo(() => {
        const base = defaultHighlightEngagementFilters;
        return JSON.stringify(filters) !== JSON.stringify(base);
    }, [filters]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-xl rounded-3xl border-border/60 bg-background/95 backdrop-blur">
                <DialogHeader>
                    <DialogTitle>Filters</DialogTitle>
                    <DialogDescription>
                        Refine engagement records by user, highlight, listing, or event.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Search (optional)
                        </label>
                        <Input
                            value={draft.search}
                            onChange={(e) => setDraft({ ...draft, search: e.target.value })}
                            placeholder="Search user, listing, event, channel, text"
                            className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Highlight ID (optional)
                        </label>
                        <Input
                            value={draft.highlightId}
                            onChange={(e) => setDraft({ ...draft, highlightId: e.target.value })}
                            placeholder="UUID"
                            className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            User ID (optional)
                        </label>
                        <Input
                            value={draft.userId}
                            onChange={(e) => setDraft({ ...draft, userId: e.target.value })}
                            placeholder="UUID"
                            className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Listing ID (optional)
                        </label>
                        <Input
                            value={draft.placeId}
                            onChange={(e) => setDraft({ ...draft, placeId: e.target.value })}
                            placeholder="UUID"
                            className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Event ID (optional)
                        </label>
                        <Input
                            value={draft.eventId}
                            onChange={(e) => setDraft({ ...draft, eventId: e.target.value })}
                            placeholder="UUID"
                            className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Sort direction
                        </label>
                        <Select
                            value={draft.sort}
                            onValueChange={(value) =>
                                setDraft({ ...draft, sort: value === "asc" ? "asc" : "desc" })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Newest" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Newest</SelectItem>
                                <SelectItem value="asc">Oldest</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Order by
                        </label>
                        <Select
                            value={draft.ordering}
                            onValueChange={() => setDraft({ ...draft, ordering: "created_at" })}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Created at" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created_at">Created at</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full text-xs mr-5 uppercase font-bold"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                    >
                        <XIcon className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="h-11 rounded-full text-xs uppercase tracking-[0.2em] text-muted-foreground"
                        onClick={() => {
                            onReset();
                            setOpen(false);
                        }}
                        disabled={isLoading || !canReset}
                    >
                        Reset
                    </Button>

                    <Button
                        type="button"
                        className="h-11 rounded-full text-xs uppercase font-bold"
                        onClick={() => {
                            onFiltersChange(draft);
                            onApply();
                            setOpen(false);
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

export default HighlightEngagementFilters;

