import Link from "next/link";
import { ExternalLink } from "lucide-react";

import type { HighlightLike } from "@/api/types";
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
    rows: HighlightLike[];
    isLoading: boolean;
};

const HighlightLikesTable = ({ rows, isLoading }: Props) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Highlight</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-16 text-right">Open</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-xs text-muted-foreground">
                                Loading likes...
                            </TableCell>
                        </TableRow>
                    ) : rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-xs text-muted-foreground">
                                No likes found for the selected filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((row) => {
                            const userName = `${row.user_first_name ?? ""} ${row.user_last_name ?? ""}`.trim() || "--";
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
                                        {highlightTitle}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {formatDateTime(row.created_at)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {row.highlight_id ? (
                                            <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                <Link href={`/highlights/${row.highlight_id}`}>
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        ) : null}
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

export default HighlightLikesTable;

