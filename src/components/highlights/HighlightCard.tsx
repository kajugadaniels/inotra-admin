import Image from "next/image";
import { Play, Trash2, Eye, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Highlight, HighlightMedia } from "@/api/highlights/listHighlights";

const pickCover = (media?: HighlightMedia[]): HighlightMedia | undefined => {
    if (!media || media.length === 0) return undefined;
    const image = media.find((m) => m.media_type === "IMAGE" && m.image_url);
    return image ?? media[0];
};

type Props = {
    highlight: Highlight;
    onView?: (highlight: Highlight) => void;
    onDelete?: (highlight: Highlight) => void;
    onEdit?: (highlight: Highlight) => void;
};

const HighlightCard = ({ highlight, onView, onDelete, onEdit }: Props) => {
    const cover = pickCover(highlight.media);
    const isVideo = cover?.media_type === "VIDEO";
    const coverUrl = cover?.image_url ?? cover?.video_url ?? "";

    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-2xl shadow-black/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10">
            <div className="relative h-44 w-full bg-muted/40">
                {coverUrl ? (
                    <Image
                        src={coverUrl}
                        alt="Highlight cover"
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, 320px"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        No media
                    </div>
                )}
                {isVideo ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-black shadow-lg">
                            <Play className="h-5 w-5" />
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">Highlight</p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {highlight.caption || "No caption"}
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] text-muted-foreground">
                        {highlight.media?.length ?? 0} media
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        {new Date(highlight.created_at ?? "").toLocaleDateString() || "--"}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full"
                            onClick={() => onView?.(highlight)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full"
                            onClick={() => onEdit?.(highlight)}
                        >
                            <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full text-destructive"
                            onClick={() => onDelete?.(highlight)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighlightCard;
