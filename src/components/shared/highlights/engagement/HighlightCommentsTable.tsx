import Link from "next/link";
import { ExternalLink, Trash2 } from "lucide-react";

import type { HighlightComment } from "@/api/types";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const formatDateTime = (value?: string | null) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

type Props = {
    rows: HighlightComment[];
    isLoading: boolean;
    busyId?: string | null;
    onDelete: (row: HighlightComment) => void;
};

const HighlightCommentsTable = ({ rows, isLoading, busyId, onDelete }: Props) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="w-[38%]">Comment</TableHead>
                        <TableHead>Highlight</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-20 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-xs text-muted-foreground">
                                Loading comments...
                            </TableCell>
                        </TableRow>
                    ) : rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-xs text-muted-foreground">
                                No comments found for the selected filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((row) => {
                            const userName =
                                `${row.user_first_name ?? ""} ${row.user_last_name ?? ""}`.trim() || "--";
                            const highlightTitle = row.place_title || row.event_title || "--";
                            return (
                                <TableRow key={row.id}>
                                    <TableCell className="text-xs font-semibold text-foreground">
                                        {userName}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {row.user_email ?? "--"}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        <span className="line-clamp-2">{row.text || "--"}</span>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {highlightTitle}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {formatDateTime(row.created_at)}
                                    </TableCell>
                                    <TableCell className="text-right space-x-1">
                                        {row.highlight_id ? (
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full"
                                            >
                                                <Link href={`/highlights/${row.highlight_id}`}>
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        ) : null}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full text-destructive"
                                            onClick={() => onDelete(row)}
                                            disabled={busyId === row.id}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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

export default HighlightCommentsTable;

