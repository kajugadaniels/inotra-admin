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

const RichTextEditor = ({
    value,
    onChange,
    disabled = false,
    placeholder = "Write something…",
    className,
}: RichTextEditorProps) => {
    const [editorCtor, setEditorCtor] = useState<unknown>(null);

    useEffect(() => {
        let alive = true;

        import("@ckeditor/ckeditor5-build-classic")
            .then((m) => {
                if (!alive) return;
                setEditorCtor(m.default);
            })
            .catch(() => {
                if (!alive) return;
                setEditorCtor(null);
            });

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

    if (!editorCtor) {
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
            <CKEditor
                editor={editorCtor}
                data={value || ""}
                config={config}
                disabled={disabled}
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
