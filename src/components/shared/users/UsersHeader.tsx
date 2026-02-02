import { Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UsersFilters, { type UsersFiltersState } from "./UsersFilters";

type UsersHeaderProps = {
    filters: UsersFiltersState;
    isLoading: boolean;
    onFiltersChange: (next: UsersFiltersState) => void;
    onReset: () => void;
};

const UsersHeader = ({ filters, isLoading, onFiltersChange, onReset }: UsersHeaderProps) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                {/* Title + description */}
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Users
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
                        User directory
                    </h1>
                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                        Review all user accounts, filter by status, and sort the latest activity.
                    </p>
                </div>

                {/* Actions + search */}
                <div className="flex w-full flex-col gap-3 lg:w-auto lg:items-end">
                    <div className="flex flex-wrap items-center gap-2">
                        <UsersFilters
                            filters={filters}
                            isLoading={isLoading}
                            onFiltersChange={onFiltersChange}
                            trigger={
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 rounded-full border-border/60 bg-background/70 text-xs shadow-sm hover:bg-background"
                                    disabled={isLoading}
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filters
                                </Button>
                            }
                        />

                        <Button
                            type="button"
                            variant="ghost"
                            className="h-11 rounded-full text-xs uppercase tracking-[0.2em] text-muted-foreground"
                            onClick={onReset}
                            disabled={isLoading}
                        >
                            Reset
                        </Button>
                    </div>

                    <div className="relative w-full sm:w-[340px]">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={filters.search}
                            onChange={(event) =>
                                onFiltersChange({ ...filters, search: event.target.value })
                            }
                            placeholder="Search name, email, username, phone"
                            className="admin-field h-11 rounded-2xl border-border/60 bg-background/60 pl-10 text-xs"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersHeader;
