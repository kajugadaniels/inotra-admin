"use client";

import Image from "next/image";
import { Eye, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";

import type { PackageListItem } from "@/api/packages";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type Props = {
    packages: PackageListItem[];
    isLoading: boolean;
    busyId?: string | null;
    onView?: (pkg: PackageListItem) => void;
    onEdit?: (pkg: PackageListItem) => void;
    onDelete?: (pkg: PackageListItem) => void;
    onToggleActive?: (pkg: PackageListItem) => void;
};

const TripPackagesTable = ({
    packages,
    isLoading,
    busyId,
    onView,
    onEdit,
    onDelete,
    onToggleActive,
}: Props) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Package</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Activities</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-28 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="py-10 text-center text-xs text-muted-foreground"
                            >
                                Loading packages...
                            </TableCell>
                        </TableRow>
                    ) : packages.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="py-10 text-center text-xs text-muted-foreground"
                            >
                                No packages found for the selected filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        packages.map((pkg) => {
                            const label = pkg.title?.trim() || "Untitled package";
                            const active = pkg.is_active ?? true;
                            return (
                                <TableRow key={pkg.id ?? label}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-14 overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
                                                {pkg.cover_url ? (
                                                    <Image
                                                        src={pkg.cover_url}
                                                        alt={label}
                                                        width={56}
                                                        height={40}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                                                        No cover
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-xs font-semibold text-foreground">
                                                    {label}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    ID: {pkg.id ? pkg.id.slice(0, 8) : "--"}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-xs text-muted-foreground">
                                        {typeof pkg.duration_days === "number"
                                            ? `${pkg.duration_days} day${pkg.duration_days === 1 ? "" : "s"}`
                                            : "--"}
                                    </TableCell>

                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                                            {pkg.activities_count ?? 0}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                                                {active ? (
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                                ) : (
                                                    <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                                )}
                                                {active ? "Active" : "Inactive"}
                                            </div>
                                            <Switch
                                                checked={!!active}
                                                disabled={!pkg.id || busyId === pkg.id}
                                                onCheckedChange={() => onToggleActive?.(pkg)}
                                                className="data-[state=checked]:bg-primary"
                                            />
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="inline-flex items-center justify-end gap-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full"
                                                onClick={() => onView?.(pkg)}
                                                disabled={!pkg.id}
                                                aria-label="View package"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full"
                                                onClick={() => onEdit?.(pkg)}
                                                disabled={!pkg.id}
                                                aria-label="Edit package"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full text-destructive"
                                                onClick={() => onDelete?.(pkg)}
                                                disabled={!pkg.id || busyId === pkg.id}
                                                aria-label="Delete package"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default TripPackagesTable;

