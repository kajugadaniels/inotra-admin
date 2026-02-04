"use client";

import { Filter, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import AdminFilters, { type AdminFiltersState } from "./AdminFilters";

type Props = {
    filters: AdminFiltersState;
    isLoading: boolean;
    onFiltersChange: (next: AdminFiltersState) => void;
    onReset: () => void;
    onCreate: () => void;
};

const AdminHeader = ({ filters, isLoading, onFiltersChange, onReset, onCreate }: Props) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Users</p>
                    <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
                        Administrators
                    </h1>
                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                        Manage admin access, activation, and account lifecycle in the portal.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-3 lg:w-auto lg:items-end">
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            type="button"
                            className="h-11 rounded-full text-xs uppercase font-bold"
                            onClick={onCreate}
                            disabled={isLoading}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New admin
                        </Button>

                        <AdminFilters
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
                </div>
            </div>
        </div>
    );
};

export default AdminHeader;
