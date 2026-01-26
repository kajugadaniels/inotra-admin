import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type AdPlacementsHeaderProps = {
    isLoading: boolean;
    onCreate: () => void;
};

const AdPlacementsHeader = ({ isLoading, onCreate }: AdPlacementsHeaderProps) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                        Ads
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
                        Ad placements
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        Manage placement keys used to organize banner inventory across the
                        platform.
                    </p>
                </div>

                <Button
                    type="button"
                    className="h-11 rounded-full"
                    onClick={onCreate}
                    disabled={isLoading}
                >
                    <Plus className="h-4 w-4" />
                    New placement
                </Button>
            </div>
        </div>
    );
};

export default AdPlacementsHeader;
