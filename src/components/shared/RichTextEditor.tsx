"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

type CKEditorComponentProps = {
    editor: unknown;
    data?: string;
    config?: Record<string, unknown>;
    disabled?: boolean;
    disableWatchdog?: boolean;
    onChange?: (event: unknown, editor: unknown) => void;
};

const CKEditor = dynamic(
    () => import("@ckeditor/ckeditor5-react").then((m) => m.CKEditor),
    { ssr: false }
) as unknown as ComponentType<CKEditorComponentProps>;

type RichTextEditorProps = {
    value: string;
    onChange: (nextHtml: string) => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
};

type CkEditorInstance = {
    getData?: () => unknown;
};

type EditorCtor = {
    create?: (...args: any[]) => any;
};

const pickEditorCtor = (mod: any): EditorCtor | null => {
    const candidates = [mod?.default, mod?.ClassicEditor, mod].filter(Boolean);
    for (const c of candidates) {
        if (c && typeof c.create === "function") return c as EditorCtor;
    }
    return null;
};

const RichTextEditor = ({
    value,
    onChange,
    disabled = false,
    placeholder = "Write something…",
    className,
}: RichTextEditorProps) => {
    const [editorCtor, setEditorCtor] = useState<EditorCtor | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                const mod = await import("@ckeditor/ckeditor5-build-classic");
                const ctor = pickEditorCtor(mod);

                if (!ctor) {
                    throw new Error(
                        "Could not resolve a valid CKEditor build. Ensure @ckeditor/ckeditor5-react and @ckeditor/ckeditor5-build-classic versions are compatible."
                    );
                }

                if (alive) {
                    setEditorCtor(ctor);
                    setLoadError(null);
                }
            } catch (e) {
                if (!alive) return;
                setEditorCtor(null);
                setLoadError(e instanceof Error ? e.message : "Failed to load editor.");
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    const config = useMemo(
        () => ({
            placeholder,
            toolbar: [
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "blockQuote",
                "undo",
                "redo",
            ],
        }),
        [placeholder]
    );

    if (loadError) {
        return (
            <div className={cn("rounded-2xl border border-border/60 bg-background/60 p-4", className)}>
                <p className="text-sm font-semibold text-foreground">Editor failed to load</p>
                <p className="mt-1 text-xs text-muted-foreground">{loadError}</p>
                <p className="mt-3 text-[11px] font-semibold text-muted-foreground">
                    Fix: align CKEditor versions (e.g. @ckeditor/ckeditor5-react@10 with @ckeditor/ckeditor5-build-classic@44).
                </p>
            </div>
        );
    }

    if (!editorCtor) {
        return (
            <div className={cn("rounded-2xl border border-border/60 bg-background/60 p-4", className)}>
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
            <CKEditor
                editor={editorCtor}
                data={value || ""}
                config={config}
                disabled={disabled}
                disableWatchdog
                onChange={(_: unknown, editor: unknown) => {
                    const instance = editor as CkEditorInstance | null;
                    const getData = instance?.getData;
                    const data = typeof getData === "function" ? getData() : "";
                    onChange(typeof data === "string" ? data : String(data ?? ""));
                }}
            />
            <p className="mt-2 text-[11px] font-semibold text-muted-foreground">
                Tip: You can format text (bold, lists, links). Content is saved as HTML.
            </p>
        </div>
    );
};

export default RichTextEditor;
