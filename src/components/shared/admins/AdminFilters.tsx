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

export type AdminFiltersState = {
    search: string;
    ordering:
        | "date_joined"
        | "email"
        | "username"
        | "name"
        | "first_name"
        | "last_name"
        | "phone";
    sort: "asc" | "desc";
    isActive: "all" | "true" | "false";
};

export const defaultAdminFilters: AdminFiltersState = {
    search: "",
    ordering: "date_joined",
    sort: "desc",
    isActive: "all",
};

const orderingOptions = [
    { value: "date_joined", label: "Newest" },
    { value: "email", label: "Email" },
    { value: "username", label: "Username" },
    { value: "name", label: "Name" },
    { value: "first_name", label: "First name" },
    { value: "last_name", label: "Last name" },
    { value: "phone", label: "Phone" },
];

type Props = {
    filters: AdminFiltersState;
    isLoading: boolean;
    onFiltersChange: (next: AdminFiltersState) => void;
    trigger?: ReactElement;
};

const AdminFilters = ({ filters, isLoading, onFiltersChange, trigger }: Props) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [draftFilters, setDraftFilters] = useState<AdminFiltersState>(filters);

    const handleOpenChange = (open: boolean) => {
        setDialogOpen(open);
        if (open) setDraftFilters(filters);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

            <DialogContent className="max-w-xl rounded-3xl border-border/60 bg-background backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle>Filter admins</DialogTitle>
                    <DialogDescription>
                        Adjust the filters below and click apply.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Order by
                        </label>
                        <Select
                            value={draftFilters.ordering}
                            onValueChange={(value) =>
                                setDraftFilters({
                                    ...draftFilters,
                                    ordering: value as AdminFiltersState["ordering"],
                                })
                            }
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                {orderingOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Sort direction
                        </label>
                        <Select
                            value={draftFilters.sort}
                            onValueChange={(value) =>
                                setDraftFilters({
                                    ...draftFilters,
                                    sort: value === "asc" ? "asc" : "desc",
                                })
                            }
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Desc</SelectItem>
                                <SelectItem value="asc">Asc</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Active state
                        </label>
                        <Select
                            value={draftFilters.isActive}
                            onValueChange={(value) =>
                                setDraftFilters({
                                    ...draftFilters,
                                    isActive: value === "true" || value === "false" ? value : "all",
                                })
                            }
                        >
                            <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full text-xs uppercase font-bold"
                        onClick={() => setDialogOpen(false)}
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

export default AdminFilters;
