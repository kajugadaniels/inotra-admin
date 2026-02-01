"use client";

import Image from "next/image";
import { BadgeCheck, FlagTriangleRight, Star, ToggleLeft } from "lucide-react";

import type { Review } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Props = {
    reviews: Review[];
    isLoading: boolean;
    busyId?: string;
    onTogglePublish: (review: Review) => void;
};

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

const ReviewsTable = ({ reviews, isLoading, busyId, onTogglePublish }: Props) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Listing</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead>Reported</TableHead>
                        <TableHead>Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                                Loading reviews...
                            </TableCell>
                        </TableRow>
                    ) : reviews.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                                No reviews found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        reviews.map((review) => {
                            const initials = (review.user_name || "User")
                                .split(" ")
                                .map((p) => p[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase();

                            return (
                                <TableRow key={review.id}>
                                    <TableCell className="text-xs">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground">{review.place_name}</span>
                                            <span className="text-muted-foreground">{review.comment}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border/60 bg-muted/60">
                                                {review.user_avatar_url ? (
                                                    <Image
                                                        src={review.user_avatar_url}
                                                        alt={review.user_name ?? "User"}
                                                        fill
                                                        sizes="36px"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase text-muted-foreground">
                                                        {initials}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-xs font-semibold text-foreground">
                                                    {review.user_name || "Unknown user"}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground">{review.user_id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-semibold">
                                            <Star className="h-3.5 w-3.5 text-amber-500" />
                                            {Number(review.rating).toFixed(1)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={!!review.published}
                                                disabled={busyId === review.id}
                                                onCheckedChange={() => onTogglePublish(review)}
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                {review.published ? "Published" : "Hidden"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div
                                            className={cn(
                                                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                                                review.is_reported
                                                    ? "border-destructive/40 bg-destructive/10 text-destructive"
                                                    : "border-border/60 bg-background/60 text-muted-foreground"
                                            )}
                                        >
                                            <FlagTriangleRight className="h-3.5 w-3.5" />
                                            {review.is_reported ? "Reported" : "Clean"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {formatDate(review.created_at)}
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

export default ReviewsTable;
