import Image from "next/image";
import { CalendarDays, Layers } from "lucide-react";

import type { PackageListItem } from "@/api/packages/listPackages";
import { cn } from "@/lib/utils";

type Props = {
    pkg: PackageListItem;
};

const TripPackageCard = ({ pkg }: Props) => {
    const title = pkg.title ?? "Untitled package";
    const duration = pkg.duration_days ?? null;
    const cover = pkg.cover_url ?? null;
    const activities = pkg.activities_count ?? 0;
    const isActive = pkg.is_active !== false;

    return (
        <div className="group overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-2xl shadow-black/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10">
            <div className="relative h-40 w-full bg-muted/40">
                {cover ? (
                    <Image
                        src={cover}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 360px"
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        No cover
                    </div>
                )}
                <div
                    className={cn(
                        "absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
                        isActive
                            ? "bg-emerald-500/15 text-emerald-700"
                            : "bg-amber-500/15 text-amber-700"
                    )}
                >
                    {isActive ? "Active" : "Inactive"}
                </div>
            </div>

            <div className="space-y-3 p-5">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Package ID: <span className="font-mono">{pkg.id ?? "—"}</span>
                    </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground">
                            {duration ? `${duration} days` : "—"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
                        <Layers className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground">
                            {activities} activities
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripPackageCard;

