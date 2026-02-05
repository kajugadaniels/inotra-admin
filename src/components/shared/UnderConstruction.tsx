"use client";

import React from "react";
import { Construction, Mail, Sparkles, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const UnderConstruction = () => {
    const items = [
        { label: "Design & layout polish", done: true },
        { label: "Backend integration", done: false },
        { label: "QA & performance checks", done: false },
        { label: "Release to production", done: false },
    ];

    return (
        <div className="relative min-h-[calc(100vh-120px)] w-full overflow-hidden">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
                <div className="absolute -bottom-48 right-[-140px] h-[620px] w-[620px] rounded-full bg-muted/50 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,120,120,0.10),transparent_55%)]" />
            </div>

            {/* Full-area card */}
            <Card className="relative h-full min-h-[calc(100vh-120px)] w-full rounded-3xl border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-10">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                            Under construction
                        </div>

                        <h1 className="flex items-center gap-2 mt-4 text-2xl font-semibold text-foreground sm:text-3xl">
                            <Construction className="h-24 w-24" />
                            This page is being built
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            We’re actively working on this feature to make it fast, secure, and easy to use.
                            Please check back soon.
                        </p>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Content */}
                <div className="grid gap-8 lg:grid-cols-1">
                    {/* Progress */}
                    <div className="space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Progress
                        </p>

                        <div className="grid gap-2">
                            {items.map((it) => (
                                <div
                                    key={it.label}
                                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/50 px-4 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        {it.done ? (
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        ) : (
                                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                        )}
                                        <p className="text-sm font-medium text-foreground">{it.label}</p>
                                    </div>

                                    <span className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                                        {it.done ? "Done" : "In progress"}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
                            <p className="text-xs text-muted-foreground">
                                Estimated release:{" "}
                                <span className="font-semibold text-foreground">Soon</span>{" "}
                                <span className="text-muted-foreground">(we’ll update this)</span>
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default UnderConstruction;
