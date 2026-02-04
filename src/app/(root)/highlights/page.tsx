"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutGrid, PlaySquare, PlusIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { deleteHighlight, listHighlights } from "@/api/highlights";
import type { Highlight } from "@/api/highlights/listHighlights";
import { getApiBaseUrl } from "@/config/api";

import HighlightGrid from "@/components/shared/highlights/HighlightGrid";
import HighlightReelsFeed from "@/components/shared/highlights/HighlightReelsFeed";
import HighlightDeleteDialog from "@/components/shared/highlights/HighlightDeleteDialog";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

type ViewMode = "preview" | "reels";

const uniqById = (prev: Highlight[], next: Highlight[]) => {
    const map = new Map<string, Highlight>();
    for (const item of prev) {
        if (item.id) map.set(item.id, item);
    }
    for (const item of next) {
        if (item.id) map.set(item.id, item);
    }
    return Array.from(map.values());
};

const HighlightsPage = () => {
    const router = useRouter();

    const [view, setView] = useState<ViewMode>("preview");

    const [items, setItems] = useState<Highlight[]>([]);
    const [count, setCount] = useState(0);

    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [selected, setSelected] = useState<Highlight | null>(null);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const loadPage = useCallback(
        async (targetPage: number, mode: "replace" | "append") => {
            const tokens = authStorage.getTokens();
            if (!tokens?.access) {
                toast.error("Session missing", {
                    description: "Sign in again to access highlights.",
                });
                return;
            }

            const setLoading = mode === "replace" ? setIsLoading : setIsLoadingMore;
            setLoading(true);

            try {
                const res = await listHighlights({
                    apiBaseUrl,
                    accessToken: tokens.access,
                    page: targetPage,
                });

                if (!res.ok || !res.body) {
                    toast.error("Unable to load highlights", {
                        description: extractErrorDetail(res.body) || "Please try again.",
                    });
                    return;
                }

                const nextResults = res.body.results ?? [];
                setCount(res.body.count ?? 0);

                // Determine if more pages exist
                // If your API includes `next`, prefer it; otherwise fallback to count math.
                const apiHasNext = Boolean(res.body.next) || targetPage * PAGE_SIZE < (res.body.count ?? 0);

                setHasNext(apiHasNext);

                if (mode === "replace") {
                    setItems(nextResults);
                    setPage(targetPage);
                } else {
                    setItems((prev) => uniqById(prev, nextResults));
                    setPage(targetPage);
                }
            } catch (error) {
                toast.error("Unable to load highlights", {
                    description: error instanceof Error ? error.message : "Check API connectivity.",
                });
            } finally {
                setLoading(false);
            }
        },
        [apiBaseUrl]
    );

    useEffect(() => {
        loadPage(1, "replace");
    }, [loadPage]);

    const loadMore = useCallback(async () => {
        if (isLoading || isLoadingMore || !hasNext) return;
        await loadPage(page + 1, "append");
    }, [hasNext, isLoading, isLoadingMore, loadPage, page]);

    // Preview infinite scroll (viewport sentinel)
    useEffect(() => {
        if (view !== "preview") return;
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) loadMore();
            },
            { root: null, rootMargin: "600px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [loadMore, view]);

    const handleDelete = useCallback(async () => {
        if (!selected?.id) return;

        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", { description: "Sign in again to delete highlights." });
            return;
        }

        setBusyId(selected.id);
        try {
            const res = await deleteHighlight({
                apiBaseUrl,
                accessToken: tokens.access,
                highlightId: selected.id,
            });

            if (!res.ok) {
                toast.error("Delete failed", { description: extractErrorDetail(res.body) });
                return;
            }

            setItems((prev) => prev.filter((h) => h.id !== selected.id));
            setCount((c) => Math.max(0, c - 1));
            toast.success("Highlight deleted");

            setDeleteOpen(false);
            setSelected(null);
        } catch (error) {
            toast.error("Delete failed", {
                description: error instanceof Error ? error.message : "Check API connectivity.",
            });
        } finally {
            setBusyId(null);
        }
    }, [apiBaseUrl, selected]);

    const onView = useCallback(
        (h: Highlight) => {
            if (!h.id) return;
            router.push(`/highlights/${h.id}`);
        },
        [router]
    );

    const onEdit = useCallback(
        (h: Highlight) => {
            if (!h.id) return;
            router.push(`/highlights/${h.id}/edit`);
        },
        [router]
    );

    const onDelete = useCallback((h: Highlight) => {
        setSelected(h);
        setDeleteOpen(true);
    }, []);

    return (
        <div className="space-y-6">
            {/* Instagram-ish header + tabs */}
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">Content</p>
                        <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
                            Highlights
                        </h1>
                        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                            Browse and manage highlights. Each highlight can include multiple images and videos.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] text-muted-foreground">
                            <span className="font-semibold text-foreground">{count}</span> posts
                        </div>
                        <Button asChild className="h-11 rounded-full text-xs font-semibold">
                            <Link href="/highlights/new">
                                <PlusIcon className="mr-2 h-4 w-4" />
                                New highlight
                            </Link>
                        </Button>

                        {/* Tabs */}
                        <div className="flex w-full items-center justify-between gap-3">
                            <div className="inline-flex rounded-full border border-border/60 bg-background/50 p-1">
                                <button
                                    type="button"
                                    onClick={() => setView("preview")}
                                    className={cn(
                                        "inline-flex h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold transition",
                                        view === "preview"
                                            ? "bg-foreground text-background"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                    Preview
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setView("reels")}
                                    className={cn(
                                        "inline-flex h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold transition",
                                        view === "reels"
                                            ? "bg-foreground text-background"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <PlaySquare className="h-4 w-4" />
                                    Reels
                                </button>
                            </div>

                            {(isLoading || isLoadingMore) && (
                                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Loading
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            {view === "preview" ? (
                <>
                    <HighlightGrid
                        highlights={items}
                        isLoading={isLoading}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />

                    {/* sentinel for infinite scroll */}
                    <div ref={sentinelRef} className="h-10" />

                    {/* subtle end-of-feed */}
                    {!hasNext && items.length > 0 ? (
                        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 text-center text-xs text-muted-foreground shadow-2xl shadow-black/5 backdrop-blur-xl">
                            You’re all caught up ✨
                        </div>
                    ) : null}
                </>
            ) : (
                <HighlightReelsFeed
                    highlights={items}
                    isLoading={isLoading}
                    isLoadingMore={isLoadingMore}
                    hasNext={hasNext}
                    onLoadMore={loadMore}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}

            <HighlightDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDelete}
                isLoading={busyId === selected?.id}
                label={selected?.caption ?? "highlight"}
            />
        </div>
    );
};

export default HighlightsPage;
