import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Eye, Pencil, Trash2, XCircle } from "lucide-react";

import type { PlaceListItem } from "@/api/types";
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

type ListingTableProps = {
    listings: PlaceListItem[];
    isLoading: boolean;
    onDelete: (listing: PlaceListItem) => void;
};

const ListingTable = ({ listings, isLoading, onDelete }: ListingTableProps) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Listing</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Verification</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                                Loading listings...
                            </TableCell>
                        </TableRow>
                    ) : listings.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                                No listings found for the selected filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        listings.map((listing) => {
                            const name = listing.name || "Untitled listing";
                            const category = listing.category_name || "Uncategorized";
                            const active = listing.is_active ?? true;
                            const verified = listing.is_verified ?? false;

                            return (
                                <TableRow key={listing.id ?? name}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-border/60 bg-muted/60">
                                                {listing.logo_url ? (
                                                    <Image
                                                        src={listing.logo_url}
                                                        alt={name}
                                                        fill
                                                        sizes="40px"
                                                        className="object-contain"
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
                                                    {(listing.city || "--") + ", " + (listing.country || "--")}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {category}
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
                                    <TableCell>
                                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                                            {verified ? (
                                                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                            ) : (
                                                <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                            )}
                                            {verified ? "Verified" : "Unverified"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {formatDate(listing.created_at)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="inline-flex items-center gap-2">
                                            {listing.id ? (
                                                <Button
                                                    asChild
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    aria-label="View listing"
                                                >
                                                    <Link href={`/listings/${listing.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            ) : null}
                                            {listing.id ? (
                                                <Button
                                                    asChild
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    aria-label="Edit listing"
                                                >
                                                    <Link href={`/listings/${listing.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            ) : null}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => onDelete(listing)}
                                                aria-label="Delete listing"
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

export default ListingTable;
