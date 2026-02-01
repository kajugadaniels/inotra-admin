"use client";

import { useCallback, useRef, useState } from "react";
import { CloudUpload, FileImage, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";

type FileUploadProps = {
    onFileSelect: (file: File | null) => void;
    accept?: string;
    disabled?: boolean;
    maxSizeMB?: number;
    label?: string;
    description?: string;
};

const FileUpload = ({
    onFileSelect,
    accept = "image/*",
    disabled = false,
    maxSizeMB = 8,
    label = "Upload",
    description = "Drag & drop or browse your files",
}: FileUploadProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFiles = useCallback(
        (files: FileList | null) => {
            setError(null);
            if (!files || files.length === 0) {
                setFileName(null);
                onFileSelect(null);
                return;
            }

            const file = files[0];
            const maxBytes = maxSizeMB * 1024 * 1024;
            if (file.size > maxBytes) {
                setError(`Max size is ${maxSizeMB}MB`);
                onFileSelect(null);
                return;
            }

            setFileName(file.name);
            onFileSelect(file);
        },
        [maxSizeMB, onFileSelect]
    );

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(event.target.files);
    };

    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (disabled) return;
        handleFiles(event.dataTransfer.files);
    };

    const onBrowse = () => {
        if (disabled) return;
        inputRef.current?.click();
    };

    return (
        <div className="space-y-2">
            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/70 bg-muted/40 px-4 py-6 text-center transition",
                    disabled ? "opacity-60" : "hover:border-primary/70 hover:bg-muted/60"
                )}
                onClick={onBrowse}
            >
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                    <CloudUpload className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={accept}
                    disabled={disabled}
                    onChange={onInputChange}
                />
            </div>

            {fileName ? (
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/80 px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                        <FileImage className="h-4 w-4 text-primary" />
                        <span className="truncate">{fileName}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleFiles(null)}
                        disabled={disabled}
                        aria-label="Remove file"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : null}

            {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
    );
};

export { FileUpload };
