"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import {
    deleteHighlightComment,
    listHighlightComments,
    listHighlightLikes,
    listHighlightShares,
} from "@/api/highlights";
import type { HighlightComment, HighlightLike, HighlightShare } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import HighlightEngagementHeader from "./HighlightEngagementHeader";
import HighlightEngagementPagination from "./HighlightEngagementPagination";
import HighlightLikesTable from "./HighlightLikesTable";
import HighlightCommentsTable from "./HighlightCommentsTable";
import HighlightSharesTable from "./HighlightSharesTable";
import HighlightCommentDeleteDialog from "./HighlightCommentDeleteDialog";
import {
    defaultHighlightEngagementFilters,
    type HighlightEngagementFiltersState,
    type HighlightEngagementTab,
} from "./types";

const PAGE_SIZE = 20;

const HighlightEngagementPanel = () => {
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const [tab, setTab] = useState<HighlightEngagementTab>("likes");
    const [filters, setFilters] = useState<HighlightEngagementFiltersState>(
        defaultHighlightEngagementFilters
    );
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [likes, setLikes] = useState<HighlightLike[]>([]);
    const [comments, setComments] = useState<HighlightComment[]>([]);
    const [shares, setShares] = useState<HighlightShare[]>([]);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [selectedComment, setSelectedComment] = useState<HighlightComment | null>(null);

    const totalPages = Math.max(Math.ceil(count / PAGE_SIZE), 1);

    useEffect(() => {
        setPage(1);
        const timer = setTimeout(() => {
            setDebouncedSearch(filters.search);
        }, 350);

        return () => clearTimeout(timer);
    }, [filters.search]);

    const fetchData = useCallback(async () => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to access highlight engagement.",
            });
            return;
        }

        setIsLoading(true);
        try {
            const baseArgs = {
                apiBaseUrl,
                accessToken: tokens.access,
                page,
                page_size: PAGE_SIZE,
                search: debouncedSearch.trim() || undefined,
                highlight_id: filters.highlightId.trim() || undefined,
                user_id: filters.userId.trim() || undefined,
                place_id: filters.placeId.trim() || undefined,
                event_id: filters.eventId.trim() || undefined,
                ordering: filters.ordering,
                sort: filters.sort,
            } as const;

            if (tab === "likes") {
                const res = await listHighlightLikes(baseArgs);
                if (!res.ok || !res.body) {
                    toast.error("Unable to load likes", {
                        description: extractErrorDetail(res.body) || "Please try again.",
                    });
                    return;
                }
                setLikes(res.body.results ?? []);
                setComments([]);
                setShares([]);
                setCount(res.body.count ?? 0);
                return;
            }

            if (tab === "comments") {
                const res = await listHighlightComments(baseArgs);
                if (!res.ok || !res.body) {
                    toast.error("Unable to load comments", {
                        description: extractErrorDetail(res.body) || "Please try again.",
                    });
                    return;
                }
                setComments(res.body.results ?? []);
                setLikes([]);
                setShares([]);
                setCount(res.body.count ?? 0);
                return;
            }

            const res = await listHighlightShares(baseArgs);
            if (!res.ok || !res.body) {
                toast.error("Unable to load shares", {
                    description: extractErrorDetail(res.body) || "Please try again.",
                });
                return;
            }
            setShares(res.body.results ?? []);
            setLikes([]);
            setComments([]);
            setCount(res.body.count ?? 0);
        } catch (error) {
            toast.error("Unable to load engagement", {
                description: error instanceof Error ? error.message : "Check API connectivity.",
            });
        } finally {
            setIsLoading(false);
        }
    }, [apiBaseUrl, debouncedSearch, filters, page, tab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onReset = () => {
        setFilters(defaultHighlightEngagementFilters);
        setPage(1);
    };

    const onApply = () => {
        setPage(1);
    };

    const handleDeleteComment = async () => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access || !selectedComment?.id) return;

        setBusyId(selectedComment.id);
        try {
            const res = await deleteHighlightComment({
                apiBaseUrl,
                accessToken: tokens.access,
                commentId: selectedComment.id,
            });

            if (!res.ok) {
                toast.error("Delete failed", {
                    description: extractErrorDetail(res.body) || "Please try again.",
                });
                return;
            }

            setComments((prev) => prev.filter((c) => c.id !== selectedComment.id));
            setCount((prev) => Math.max(prev - 1, 0));
            setDeleteOpen(false);
            setSelectedComment(null);
            toast.success("Comment deleted");
        } catch (error) {
            toast.error("Delete failed", {
                description: error instanceof Error ? error.message : "Check API connectivity.",
            });
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="space-y-6">
            <HighlightEngagementHeader
                tab={tab}
                total={count}
                isLoading={isLoading}
                filters={filters}
                onTabChange={(next) => {
                    setTab(next);
                    setPage(1);
                }}
                onFiltersChange={(next) => setFilters(next)}
                onApply={onApply}
                onReset={onReset}
            />

            {tab === "likes" ? (
                <HighlightLikesTable rows={likes} isLoading={isLoading} />
            ) : null}
            {tab === "comments" ? (
                <HighlightCommentsTable
                    rows={comments}
                    isLoading={isLoading}
                    busyId={busyId}
                    onDelete={(row) => {
                        setSelectedComment(row);
                        setDeleteOpen(true);
                    }}
                />
            ) : null}
            {tab === "shares" ? (
                <HighlightSharesTable rows={shares} isLoading={isLoading} />
            ) : null}

            <HighlightEngagementPagination
                page={page}
                totalPages={totalPages}
                isLoading={isLoading}
                onPageChange={setPage}
            />

            <HighlightCommentDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDeleteComment}
                isLoading={busyId === selectedComment?.id}
            />
        </div>
    );
};

export default HighlightEngagementPanel;
