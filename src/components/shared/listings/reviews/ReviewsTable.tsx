"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, FlagTriangleRight, Star, X } from "lucide-react";

import type { Review } from "@/api/types";
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

const getInitials = (name?: string | null) =>
    (name || "User")
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

const ReviewsTable = ({ reviews, isLoading, busyId, onTogglePublish }: Props) => {
    const uid = useId();
    const [active, setActive] = useState<Review | null>(null);

    // Lock body scroll while modal is open + close on ESC
    useEffect(() => {
        if (!active) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setActive(null);
        };
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [active]);

    const activeKey = useMemo(() => {
        if (!active?.id) return `review-${uid}`;
        return `review-${active.id}-${uid}`;
    }, [active?.id, uid]);

    return (
        <>
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
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="py-10 text-center text-sm text-muted-foreground"
                                >
                                    Loading reviews...
                                </TableCell>
                            </TableRow>
                        ) : reviews.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="py-10 text-center text-sm text-muted-foreground"
                                >
                                    No reviews found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reviews.map((review) => {
                                const initials = getInitials(review.user_name);

                                return (
                                    <TableRow key={review.id}>
                                        <TableCell className="text-xs">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground">
                                                    {review.place_name || "Unknown listing"}
                                                </span>
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

                                        <TableCell className="text-right">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-9 rounded-full text-xs"
                                                onClick={() => setActive(review)}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Expandable-card style modal (Aceternity-like) */}
            <AnimatePresence>
                {active ? (
                    <>
                        <motion.div
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActive(null)}
                        />

                        <motion.div
                            layoutId={activeKey}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        >
                            <div
                                className="w-full max-w-2xl overflow-hidden rounded-3xl border border-border/60 bg-background/90 shadow-2xl backdrop-blur-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4">
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                                            Review details
                                        </p>
                                        <h2 className="mt-1 truncate text-lg font-semibold text-foreground">
                                            {active.place_name || "Unknown listing"}
                                        </h2>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Created {formatDate(active.created_at)}
                                        </p>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-9 w-9 rounded-full p-0"
                                        onClick={() => setActive(null)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="space-y-4 p-5">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-semibold">
                                            <Star className="h-3.5 w-3.5 text-amber-500" />
                                            {Number(active.rating).toFixed(1)}
                                        </div>

                                        <div
                                            className={cn(
                                                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                                                active.is_reported
                                                    ? "border-destructive/40 bg-destructive/10 text-destructive"
                                                    : "border-border/60 bg-background/60 text-muted-foreground"
                                            )}
                                        >
                                            <FlagTriangleRight className="h-3.5 w-3.5" />
                                            {active.is_reported ? "Reported" : "Clean"}
                                        </div>

                                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                                            {active.published ? "Published" : "Hidden"}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-3">
                                        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border/60 bg-muted/60">
                                            {active.user_avatar_url ? (
                                                <Image
                                                    src={active.user_avatar_url}
                                                    alt={active.user_name ?? "User"}
                                                    fill
                                                    sizes="40px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold uppercase text-muted-foreground">
                                                    {getInitials(active.user_name)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-foreground">
                                                {active.user_name || "Unknown user"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Review author
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                            Comment
                                        </p>
                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                                            {active.comment || "--"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/60 px-5 py-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-11 rounded-full text-xs uppercase font-bold"
                                        onClick={() => setActive(null)}
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                ) : null}
            </AnimatePresence>
        </>
    );
};

export default ReviewsTable;
