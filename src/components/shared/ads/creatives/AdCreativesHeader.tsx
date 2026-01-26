import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type AdCreativesHeaderProps = {
    isLoading: boolean;
    onCreate: () => void;
};

const AdCreativesHeader = ({ isLoading, onCreate }: AdCreativesHeaderProps) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                        Ads
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
                        Ad creatives
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        Create and manage banner creatives linked to placements and schedules.
                    </p>
                </div>

                <Button
                    type="button"
                    className="h-11 rounded-full"
                    onClick={onCreate}
                    disabled={isLoading}
                >
                    <Plus className="h-4 w-4" />
                    New creative
                </Button>
            </div>
        </div>
    );
};

export default AdCreativesHeader;
