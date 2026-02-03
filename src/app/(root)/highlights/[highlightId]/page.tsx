"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowBigLeft, Play } from "lucide-react";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { getHighlight } from "@/api/highlights";
import type { Highlight } from "@/api/highlights/listHighlights";
import { getApiBaseUrl } from "@/config/api";
import { Button } from "@/components/ui/button";

const HighlightDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const highlightId = params?.highlightId as string | undefined;
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const [highlight, setHighlight] = useState<Highlight | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access || !highlightId) {
            toast.error("Session missing", { description: "Sign in again to view highlight." });
            router.replace("/highlights");
            return;
        }
        getHighlight({ apiBaseUrl, accessToken: tokens.access, highlightId })
            .then((res) => {
                if (!res.ok || !res.body) {
                    toast.error("Unable to load highlight", { description: extractErrorDetail(res.body) });
                    router.replace("/highlights");
                    return;
                }
                setHighlight(res.body);
            })
            .catch((error: Error) => {
                toast.error("Unable to load highlight", {
                    description: error.message ?? "Check API connectivity.",
                });
                router.replace("/highlights");
            })
            .finally(() => setIsLoading(false));
    }, [apiBaseUrl, highlightId, router]);

    if (isLoading) {
        return (
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 text-sm text-muted-foreground shadow-2xl shadow-black/5">
                Loading highlight...
            </div>
        );
    }

    if (!highlight) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground">Highlight</p>
                        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Highlight detail</h1>
                        <p className="text-sm text-muted-foreground">{highlight.caption || "No caption"}</p>
                        <div className="text-xs text-muted-foreground">
                            Created: {new Date(highlight.created_at ?? "").toLocaleString() || "--"}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            className="rounded-full text-xs h-11 uppercase font-bold"
                            onClick={() => router.push("/highlights")}
                        >
                            <ArrowBigLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {highlight.media?.map((m) => (
                    <div
                        key={m.id ?? m.caption}
                        className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/60"
                    >
                        {m.media_type === "VIDEO" ? (
                            <div className="relative h-56 w-full bg-black/80">
                                {m.video_url ? (
                                    <video
                                        src={m.video_url}
                                        controls
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                        No video
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="grid h-10 w-10 place-items-center rounded-full bg-white/80 text-black shadow">
                                        <Play className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative h-56 w-full bg-muted/40">
                                {m.image_url ? (
                                    <Image
                                        src={m.image_url}
                                        alt={m.caption ?? "Highlight media"}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width:768px) 100vw, 360px"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                        No image
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="p-3 text-xs text-muted-foreground">{m.caption || "—"}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HighlightDetailPage;
