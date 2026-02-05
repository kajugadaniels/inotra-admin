"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

type TinyMceEditorProps = {
    apiKey?: string;
    value?: string;
    onEditorChange?: (content: string) => void;
    init?: Record<string, unknown>;
    disabled?: boolean;
};

const TinyMceEditor = dynamic(
    () => import("@tinymce/tinymce-react").then((m) => m.Editor),
    { ssr: false }
) as unknown as ComponentType<TinyMceEditorProps>;

type RichTextEditorProps = {
    value: string;
    onChange: (nextHtml: string) => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
};

const RichTextEditor = ({
    value,
    onChange,
    disabled = false,
    placeholder = "Write something…",
    className,
}: RichTextEditorProps) => {
    const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY ?? "no-api-key";

    const init = useMemo<Record<string, unknown>>(
        () => ({
            height: 220,
            menubar: false,
            statusbar: false,
            branding: false,
            promotion: false,
            placeholder,

            // Keep it clean and fast
            plugins: "lists link autoresize",
            toolbar:
                "bold italic underline | bullist numlist | blockquote | link | undo redo | removeformat",

            // Better paste behavior
            paste_as_text: false,
            paste_data_images: false,

            // Content styling inside the editor iframe
            content_style:
                "body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial; font-size:14px; line-height:1.6; padding:8px;}",

            // Respect readonly
            readonly: disabled,

            // Avoid noisy UI
            contextmenu: false,
        }),
        [disabled, placeholder]
    );

    // Dynamic component loading skeleton
    if (!TinyMceEditor) {
        return (
            <div
                className={cn(
                    "rounded-2xl border border-border/60 bg-background/60 p-4",
                    className
                )}
            >
                <div className="h-4 w-40 animate-pulse rounded bg-muted/60" />
                <div className="mt-3 h-24 w-full animate-pulse rounded-xl bg-muted/60" />
                <p className="mt-3 text-[11px] font-semibold text-muted-foreground">
                    Loading editor…
                </p>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "rounded-2xl border border-border/60 bg-background/60 p-3",
                disabled && "opacity-70",
                className
            )}
        >
            <TinyMceEditor
                apiKey={apiKey}
                value={value || ""}
                disabled={disabled}
                init={init}
                onEditorChange={(content) => onChange(content)}
            />

            <p className="mt-2 text-[11px] font-semibold text-muted-foreground">
                Tip: You can format text (bold, lists, links). Content is saved as HTML.
            </p>
        </div>
    );
};

export default RichTextEditor;
