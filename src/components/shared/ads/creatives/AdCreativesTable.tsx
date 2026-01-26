import { CheckCircle2, Eye, Pencil, Trash2, XCircle } from "lucide-react";

import type { AdCreative } from "@/api/types";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Image from "next/image";

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

type AdCreativesTableProps = {
    creatives: AdCreative[];
    isLoading: boolean;
    onView: (creative: AdCreative) => void;
    onEdit: (creative: AdCreative) => void;
    onDelete: (creative: AdCreative) => void;
};

const AdCreativesTable = ({
    creatives,
    isLoading,
    onView,
    onEdit,
    onDelete,
}: AdCreativesTableProps) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Creative</TableHead>
                        <TableHead>Placement</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                                Loading creatives...
                            </TableCell>
                        </TableRow>
                    ) : creatives.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                                No creatives found for the selected filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        creatives.map((creative) => {
                            const title = creative.title || "Untitled creative";
                            const active = creative.is_active ?? true;

                            return (
                                <TableRow key={creative.id ?? `${creative.title}-${creative.placement_key}`}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
                                                {creative.image_url ? (
                                                    <Image
                                                        src={creative.image_url}
                                                        alt={title}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : null}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-foreground">
                                                    {title}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {creative.placement_key ?? "--"}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(creative.starts_at)} → {formatDate(creative.ends_at)}
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
                                    <TableCell className="text-right">
                                        <div className="inline-flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => onView(creative)}
                                                aria-label="View creative"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => onEdit(creative)}
                                                aria-label="Edit creative"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => onDelete(creative)}
                                                aria-label="Delete creative"
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

export default AdCreativesTable;
