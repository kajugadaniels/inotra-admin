"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

import type { HighlightMedia } from "@/api/highlights/listHighlights";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getMediaUrl } from "./highlight-utils";

type Props = {
    media: HighlightMedia[];
    mode: "preview" | "reel";
    active?: boolean; // used in reels to autoplay/pause videos
};

const HighlightMediaCarousel = ({ media, mode, active }: Props) => {
    const items = useMemo(() => media ?? [], [media]);
    const [index, setIndex] = useState(0);

    const current = items[index];
    const url = getMediaUrl(current);
    const isVideo = current?.media_type === "VIDEO" && !!current.video_url;

    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        setIndex(0);
    }, [items.length]);

    // Reels autoplay/pause behavior
    useEffect(() => {
        if (!isVideo) return;

        const v = videoRef.current;
        if (!v) return;

        if (active) {
            v.muted = true;
            v.playsInline = true;
            v.loop = true;
            v.play().catch(() => {});
        } else {
            v.pause();
        }
    }, [active, isVideo, index]);

    const canNav = items.length > 1;

    const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
    const next = () => setIndex((i) => (i + 1) % items.length);

    return (
        <div
            className={cn(
                "relative h-full w-full overflow-hidden bg-black",
                mode === "preview" ? "rounded-2xl" : "rounded-3xl"
            )}
        >
            {url ? (
                isVideo ? (
                    <div className="relative h-full w-full">
                        <video
                            ref={videoRef}
                            src={url}
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                            loop
                            controls={false}
                        />
                        {/* tap-to-play hint (only for preview mode) */}
                        {mode === "preview" ? (
                            <div className="pointer-events-none absolute inset-0 grid place-items-center">
                                <div className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-black shadow-lg">
                                    <Play className="h-5 w-5" />
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <Image
                        src={url}
                        alt="Highlight media"
                        fill
                        sizes={mode === "preview" ? "(max-width:768px) 50vw, 25vw" : "(max-width:768px) 100vw, 420px"}
                        className="object-cover"
                    />
                )
            ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-white/70">
                    No media
                </div>
            )}

            {/* Dots + counter */}
            {canNav ? (
                <>
                    <div className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] text-white">
                        {index + 1}/{items.length}
                    </div>

                    <div className="absolute top-3 left-1/2 -translate-x-1/2">
                        <div className="flex items-center gap-1 rounded-full bg-black/30 px-2 py-1">
                            {items.map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "h-1.5 w-1.5 rounded-full",
                                        i === index ? "bg-white" : "bg-white/35"
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-black/35 text-white hover:bg-black/45"
                        onClick={(e) => {
                            e.stopPropagation();
                            prev();
                        }}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-black/35 text-white hover:bg-black/45"
                        onClick={(e) => {
                            e.stopPropagation();
                            next();
                        }}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </>
            ) : null}
        </div>
    );
};

export default HighlightMediaCarousel;
