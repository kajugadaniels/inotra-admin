import { Phone } from "lucide-react";

import type { PlaceDetail } from "@/api/types";

type ListingContactDetailsProps = {
    listing: PlaceDetail | null;
    isLoading: boolean;
};

const ListingContactDetails = ({
    listing,
    isLoading,
}: ListingContactDetailsProps) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 w-[850px] max-w-full backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                <Phone className="h-4 w-4" />
                Contact
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Phone
                    </p>
                    <p className="mt-2 text-xs font-semibold text-foreground">
                        {listing?.phone || "--"}
                    </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        WhatsApp
                    </p>
                    <p className="mt-2 text-xs font-semibold text-foreground">
                        {listing?.whatsapp || "--"}
                    </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Email
                    </p>
                    <p className="mt-2 text-xs font-semibold text-foreground">
                        {listing?.email || "--"}
                    </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Website
                    </p>
                    <p className="mt-2 text-xs font-semibold text-foreground">
                        {listing?.website || "--"}
                    </p>
                </div>
            </div>
            {!listing && isLoading ? (
                <p className="mt-4 text-xs text-muted-foreground">Loading contact…</p>
            ) : null}
        </div>
    );
};

export default ListingContactDetails;
