import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Eye, Pencil, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { updatePlace } from "@/api/places";
import type { PlaceListItem } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

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
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
    const [rows, setRows] = useState<PlaceListItem[]>(listings);
    const [busy, setBusy] = useState<Record<string, { active?: boolean; verified?: boolean }>>(
        {}
    );

    useEffect(() => {
        setRows(listings);
    }, [listings]);

    const toggleField = async (
        listing: PlaceListItem,
        field: "is_active" | "is_verified",
        nextValue: boolean
    ) => {
        if (!listing.id) return;
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to update listings.",
            });
            return;
        }

        setBusy((prev) => ({
            ...prev,
            [listing.id!]: { ...(prev[listing.id!] || {}), [field === "is_active" ? "active" : "verified"]: true },
        }));

        try {
            const result = await updatePlace({
                apiBaseUrl,
                accessToken: tokens.access,
                placeId: listing.id,
                data: { [field]: nextValue },
            });

            if (!result.ok || !result.body) {
                const detail = extractErrorDetail(result.body);
                toast.error("Update failed", { description: detail });
                return;
            }

            setRows((prev) =>
                prev.map((row) =>
                    row.id === listing.id ? { ...row, [field]: nextValue } : row
                )
            );

            toast.success("Listing updated", {
                description: `${field === "is_active" ? "Active" : "Verified"} set to ${
                    nextValue ? "true" : "false"
                }.`,
            });
        } catch (error) {
            toast.error("Update failed", {
                description:
                    error instanceof Error ? error.message : "Check API connectivity and retry.",
            });
        } finally {
            setBusy((prev) => ({
                ...prev,
                [listing.id!]: {
                    ...(prev[listing.id!] || {}),
                    [field === "is_active" ? "active" : "verified"]: false,
                },
            }));
        }
    };

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
                    ) : rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                                No listings found for the selected filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((listing) => {
                            const name = listing.name || "Untitled listing";
                            const category = listing.category_name || "Uncategorized";
                            const active = listing.is_active ?? true;
                            const verified = listing.is_verified ?? false;
                            const statusBusy = busy[listing.id ?? ""]?.active;
                            const verifiedBusy = busy[listing.id ?? ""]?.verified;

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
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={active}
                                                disabled={statusBusy}
                                                onCheckedChange={(checked) =>
                                                    toggleField(listing, "is_active", checked)
                                                }
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                {active ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={verified}
                                                disabled={verifiedBusy}
                                                onCheckedChange={(checked) =>
                                                    toggleField(listing, "is_verified", checked)
                                                }
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                {verified ? "Verified" : "Unverified"}
                                            </span>
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
