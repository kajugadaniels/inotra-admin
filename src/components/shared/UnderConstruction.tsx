"use client";

import React from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Construction,
    Mail,
    Sparkles,
    CheckCircle2,
    Loader2,
} from "lucide-react";

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
        <div className="relative min-h-[calc(100vh-120px)] overflow-hidden">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
                <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-muted/50 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,120,120,0.10),transparent_55%)]" />
            </div>

            <div className="relative mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
                {/* Top bar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button asChild variant="ghost" className="h-10 rounded-full">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to dashboard
                        </Link>
                    </Button>

                    <Badge className="rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.18em]">
                        IN PROGRESS
                    </Badge>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-12">
                    {/* Main */}
                    <Card className="rounded-3xl border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-8">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                                    <Construction className="h-4 w-4" />
                                    Under construction
                                </div>

                                <h1 className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">
                                    This page is being built ✨
                                </h1>

                                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                    We’re actively working on this feature to make it fast, secure, and
                                    easy to use. Please check back soon.
                                </p>
                            </div>

                            <div className="hidden sm:block">
                                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-border/60 bg-background/60">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Progress checklist */}
                        <div className="space-y-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
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
                                            <p className="text-sm font-medium text-foreground">
                                                {it.label}
                                            </p>
                                        </div>

                                        <span className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] text-muted-foreground">
                                            {it.done ? "Done" : "In progress"}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 rounded-2xl border border-border/60 bg-background/50 p-4">
                                <p className="text-xs text-muted-foreground">
                                    Estimated release:{" "}
                                    <span className="font-semibold text-foreground">Soon</span>{" "}
                                    <span className="text-muted-foreground">(we’ll update this)</span>
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
                            <Button asChild className="h-11 rounded-full">
                                <Link href="/">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Go back
                                </Link>
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 rounded-full border-border/60 bg-background/70"
                                onClick={() => {
                                    // Change this email if you want
                                    window.location.href =
                                        "mailto:support@nexcode.africa?subject=Feature%20request&body=Hello%20team,%20I%20wanted%20to%20ask%20about%20the%20page%20currently%20under%20construction...";
                                }}
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Contact support
                            </Button>

                            <p className="text-xs text-muted-foreground sm:ml-auto">
                                Need help? Contact support for priority access.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UnderConstruction;
