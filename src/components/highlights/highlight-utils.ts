import type { HighlightMedia } from "@/api/highlights/listHighlights";

export const formatShortDate = (value?: string | null) => {
    if (!value) return "--";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "--";
    return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" }).format(d);
};

export const pickCover = (media?: HighlightMedia[]) => {
    if (!media?.length) return undefined;
    const img = media.find((m) => m.media_type === "IMAGE" && m.image_url);
    return img ?? media[0];
};

export const getMediaUrl = (m?: HighlightMedia) => {
    if (!m) return "";
    return m.image_url ?? m.video_url ?? "";
};
