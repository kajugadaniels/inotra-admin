import { CheckCircle2, Eye, Pencil, Trash2, XCircle } from "lucide-react";

import type { PlaceCategory } from "@/api/types";
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

type ListingCategoriesTableProps = {
    categories: PlaceCategory[];
    isLoading: boolean;
    onView: (category: PlaceCategory) => void;
    onEdit: (category: PlaceCategory) => void;
    onDelete: (category: PlaceCategory) => void;
};

const ListingCategoriesTable = ({
    categories,
    isLoading,
    onView,
    onEdit,
    onDelete,
}: ListingCategoriesTableProps) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Listing category</TableHead>
                        <TableHead>Icon</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-xs text-muted-foreground">
                                Loading listing categories...
                            </TableCell>
                        </TableRow>
                    ) : categories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-xs text-muted-foreground">
                                No listing categories found for the selected filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        categories.map((category) => {
                            const name = category.name || "Untitled category";
                            const icon = category.icon || "--";
                            const active = category.is_active ?? true;

                            return (
                                <TableRow key={category.id ?? name}>
                                    <TableCell>
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-foreground">
                                                {name}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {icon}
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
                                    <TableCell className="text-xs text-muted-foreground">
                                        {formatDate(category.created_at)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="inline-flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => onView(category)}
                                                aria-label="View listing category"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => onEdit(category)}
                                                aria-label="Edit listing category"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => onDelete(category)}
                                                aria-label="Delete listing category"
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

export default ListingCategoriesTable;
