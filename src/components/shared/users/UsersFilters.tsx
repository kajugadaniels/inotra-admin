import { Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type UsersFiltersState = {
    search: string;
    ordering: string;
    sort: "asc" | "desc";
    isActive: "all" | "true" | "false";
};

type UsersFiltersProps = {
    filters: UsersFiltersState;
    isLoading: boolean;
    onFiltersChange: (next: UsersFiltersState) => void;
    onReset: () => void;
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

const UsersFilters = ({ filters, isLoading, onFiltersChange, onReset }: UsersFiltersProps) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-5 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-foreground">Filters</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Search and refine the user list.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                    onClick={onReset}
                    disabled={isLoading}
                >
                    Reset
                </Button>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-4">
                <div className="lg:col-span-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Search
                    </label>
                    <div className="relative mt-2">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={filters.search}
                            onChange={(event) =>
                                onFiltersChange({ ...filters, search: event.target.value })
                            }
                            placeholder="Search name, email, username, phone"
                            className="h-11 rounded-2xl border-border/60 bg-background/60 pl-10"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Order by
                    </label>
                    <Select
                        value={filters.ordering}
                        onValueChange={(value) =>
                            onFiltersChange({ ...filters, ordering: value })
                        }
                        disabled={isLoading}
                    >
                        <SelectTrigger className="mt-2 w-full rounded-2xl border-border/60 bg-background/60">
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
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Sort & status
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <Select
                            value={filters.sort}
                            onValueChange={(value) =>
                                onFiltersChange({
                                    ...filters,
                                    sort: value === "asc" ? "asc" : "desc",
                                })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-[130px] rounded-2xl border-border/60 bg-background/60">
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Desc</SelectItem>
                                <SelectItem value="asc">Asc</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.isActive}
                            onValueChange={(value) =>
                                onFiltersChange({
                                    ...filters,
                                    isActive:
                                        value === "true" || value === "false" ? value : "all",
                                })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-[160px] rounded-2xl border-border/60 bg-background/60">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All status</SelectItem>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
                            <Filter className="h-3.5 w-3.5" />
                            Filters applied
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersFilters;
