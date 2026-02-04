import { Loader2 } from "lucide-react";

import type { PackageListItem } from "@/api/packages/listPackages";
import TripPackageCard from "./TripPackageCard";

type Props = {
    packages: PackageListItem[];
    isLoading: boolean;
    isLoadingMore: boolean;
};

const TripPackagesGrid = ({ packages, isLoading, isLoadingMore }: Props) => {
    if (isLoading && packages.length === 0) {
        return (
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 text-sm text-muted-foreground shadow-2xl shadow-black/5">
                Loading packages...
            </div>
        );
    }

    if (!isLoading && packages.length === 0) {
        return (
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 text-sm text-muted-foreground shadow-2xl shadow-black/5">
                No packages found. Try adjusting search or filters.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {packages.map((pkg) => (
                    <TripPackageCard key={pkg.id ?? pkg.title} pkg={pkg} />
                ))}
            </div>

            {isLoadingMore ? (
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading more packages...
                </div>
            ) : null}
        </div>
    );
};

export default TripPackagesGrid;

