import { CheckCircle2, Eye, Pencil, Trash2, XCircle } from "lucide-react";

import type { AdPlacement } from "@/api/types";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const formatDate = (value?: string | null) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
};

type AdPlacementsTableProps = {
    placements: AdPlacement[];
    isLoading: boolean;
    onView: (placement: AdPlacement) => void;
    onEdit: (placement: AdPlacement) => void;
    onDelete: (placement: AdPlacement) => void;
};

const AdPlacementsTable = ({
    placements,
    isLoading,
    onView,
    onEdit,
    onDelete,
}: AdPlacementsTableProps) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Placement</TableHead>
                        <TableHead>Key</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                                Loading placements...
                            </TableCell>
                        </TableRow>
                    ) : placements.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                                No placements found for the selected filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        placements.map((placement) => {
                            const title = placement.title || "Untitled placement";
                            const key = placement.key ?? "--";
                            const active = placement.is_active ?? true;

                            return (
                                <TableRow key={placement.id ?? key}>
                                    <TableCell>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-foreground">
                                                {title}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {key}
                                    </TableCell>
                                    <TableCell>
                                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                                            {active ? (
                                                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                            ) : (
                                                <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                            )}
                                            {active ? "Active" : "Inactive"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(placement.created_at)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="inline-flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => onView(placement)}
                                                aria-label="View placement"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => onEdit(placement)}
                                                aria-label="Edit placement"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => onDelete(placement)}
                                                aria-label="Delete placement"
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
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

export default AdPlacementsTable;
