"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { deleteHighlight, listHighlights } from "@/api/highlights";
import type { Highlight } from "@/api/highlights/listHighlights";
import { getApiBaseUrl } from "@/config/api";
import {
    HighlightDeleteDialog,
    HighlightGrid,
    HighlightPagination,
} from "@/components/highlights";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

const HighlightsPage = () => {
    const [page, setPage] = useState(1);
    const [results, setResults] = useState<Highlight[]>([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [selected, setSelected] = useState<Highlight | null>(null);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", { description: "Sign in again to access highlights." });
            return;
        }

        setIsLoading(true);
        listHighlights({ apiBaseUrl, accessToken: tokens.access, page })
            .then((res) => {
                if (!res.ok || !res.body) {
                    toast.error("Unable to load highlights", {
                        description: extractErrorDetail(res.body) || "Please try again.",
                    });
                    return;
                }
                setResults(res.body.results ?? []);
                setCount(res.body.count ?? 0);
            })
            .catch((error: Error) => {
                toast.error("Unable to load highlights", {
                    description: error.message ?? "Check API connectivity.",
                });
            })
            .finally(() => setIsLoading(false));
    }, [apiBaseUrl, page]);

    const totalPages = Math.max(Math.ceil(count / 20), 1);

    const handleDelete = async () => {
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
            setResults((prev) => prev.filter((h) => h.id !== selected.id));
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
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground">Content</p>
                        <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">Highlights</h1>
                        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                            Browse and manage highlights. Each highlight can include multiple images and videos.
                        </p>
                    </div>
                    <Button asChild className="h-11 rounded-full text-xs uppercase font-bold">
                        <Link href="/highlights/new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            New highlight
                        </Link>
                    </Button>
                </div>
            </div>

            <HighlightGrid
                highlights={results}
                isLoading={isLoading}
                onDelete={(h) => {
                    setSelected(h);
                    setDeleteOpen(true);
                }}
                onView={(h) => {
                    if (h.id) {
                        window.location.href = `/highlights/${h.id}`;
                    }
                }}
                onEdit={(h) => {
                    if (h.id) window.location.href = `/highlights/${h.id}/edit`;
                }}
            />

            <HighlightPagination
                page={page}
                totalPages={totalPages}
                isLoading={isLoading}
                onPageChange={setPage}
            />

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
