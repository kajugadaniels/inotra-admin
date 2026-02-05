"use client";

import DOMPurify from "dompurify";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

type RichTextRendererProps = {
    html?: string | null;
    className?: string;
};

const RichTextRenderer = ({ html, className }: RichTextRendererProps) => {
    const safeHtml = useMemo(() => {
        const raw = (html ?? "").trim();
        if (!raw) return "";

        return DOMPurify.sanitize(raw, {
            USE_PROFILES: { html: true },
            ALLOWED_TAGS: [
                "p",
                "br",
                "strong",
                "b",
                "em",
                "i",
                "u",
                "s",
                "a",
                "ul",
                "ol",
                "li",
                "blockquote",
                "h1",
                "h2",
                "h3",
                "h4",
                "code",
                "pre",
                "span",
            ],
            ALLOWED_ATTR: ["href", "target", "rel"],
        });
    }, [html]);

    if (!safeHtml) return null;

    return (
        <div
            className={cn(
                // Premium, readable typography
                "text-sm leading-relaxed text-muted-foreground",
                // Prose-like spacing without gradients
                "[&>p]:mt-3 [&>p:first-child]:mt-0",
                "[&>ul]:mt-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mt-1",
                "[&>ol]:mt-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol>li]:mt-1",
                "[&>blockquote]:mt-4 [&>blockquote]:rounded-2xl [&>blockquote]:border [&>blockquote]:border-border/60 [&>blockquote]:bg-background/50 [&>blockquote]:p-4 [&>blockquote]:text-foreground/80",
                "[&>h1]:mt-4 [&>h1]:text-lg [&>h1]:font-semibold [&>h1]:text-foreground",
                "[&>h2]:mt-4 [&>h2]:text-base [&>h2]:font-semibold [&>h2]:text-foreground",
                "[&>h3]:mt-4 [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:text-foreground",
                "[&_a]:font-semibold [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4",
                "[&_code]:rounded [&_code]:bg-background/60 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12px] [&_code]:text-foreground",
                "[&_pre]:mt-3 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-border/60 [&_pre]:bg-background/60 [&_pre]:p-4",
                className
            )}
            dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
    );
};

export default RichTextRenderer;
