"use client";

import Image from "next/image";
import { CheckCircle2, XCircle } from "lucide-react";

import type { ListingSubmissionListItem } from "@/api/types";
import { Badge } from "@/components/ui/badge";
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

const statusVariant = (status?: string | null) => {
    switch (status) {
        case "APPROVED":
            return "default" as const;
        case "REJECTED":
            return "destructive" as const;
        case "PENDING":
        default:
            return "secondary" as const;
    }
};

type ListingRequestsTableProps = {
    requests: ListingSubmissionListItem[];
    isLoading: boolean;
    onApprove: (request: ListingSubmissionListItem) => void;
    onReject: (request: ListingSubmissionListItem) => void;
};

const ListingRequestsTable = ({
    requests,
    isLoading,
    onApprove,
    onReject,
}: ListingRequestsTableProps) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Listing</TableHead>
                        <TableHead>Submitter</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                                Loading listing requests...
                            </TableCell>
                        </TableRow>
                    ) : requests.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                                No listing submissions found for the selected filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        requests.map((request) => {
                            const name = request.name || "Untitled submission";
                            const location = `${request.city || "--"}, ${request.country || "--"}`;
                            const createdAt = formatDate(request.created_at);
                            const submitter =
                                request.submitted_by_name ||
                                request.submitted_by_email ||
                                request.submitted_by_phone ||
                                "--";

                            return (
                                <TableRow key={request.id ?? name}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-border/60 bg-muted/60">
                                                {request.first_image_url ? (
                                                    <Image
                                                        src={request.first_image_url}
                                                        alt={name}
                                                        fill
                                                        sizes="40px"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase text-muted-foreground">
                                                        {name.slice(0, 2)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-xs font-semibold text-foreground">
                                                    {name}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {location}
                                                </p>
                                                <p className="mt-1 text-[11px] text-muted-foreground">
                                                    {request.category_name || "Uncategorized"}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {submitter}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant(request.status)} className="rounded-full">
                                            {request.status || "PENDING"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {createdAt}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-9 rounded-full text-xs"
                                                onClick={() => onApprove(request)}
                                                disabled={request.status === "APPROVED"}
                                            >
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" />
                                                Approve
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                className="h-9 rounded-full text-xs"
                                                onClick={() => onReject(request)}
                                                disabled={request.status === "REJECTED" || request.status === "APPROVED"}
                                            >
                                                <XCircle className="mr-2 h-4 w-4" />
                                                Reject
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

export default ListingRequestsTable;
