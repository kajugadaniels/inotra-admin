import { Mail, Phone, Globe, MessageCircle } from "lucide-react";

import type { ListingSubmissionDetail } from "@/api/types";

type Props = {
    submission: ListingSubmissionDetail | null;
    isLoading: boolean;
};

const ListingSubmissionContactDetails = ({ submission, isLoading }: Props) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 max-w-full backdrop-blur-xl grid w-full grid-cols-1 gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                <Phone className="h-4 w-4" />
                Contact
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground inline-flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                    </p>
                    <p className="mt-2 text-xs font-semibold text-foreground">
                        {submission?.phone || "--"}
                    </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground inline-flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                    </p>
                    <p className="mt-2 text-xs font-semibold text-foreground">
                        {submission?.whatsapp || "--"}
                    </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground inline-flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                    </p>
                    <p className="mt-2 text-xs font-semibold text-foreground">
                        {submission?.email || "--"}
                    </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground inline-flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Website
                    </p>
                    <p className="mt-2 text-xs font-semibold text-foreground">
                        {submission?.website || "--"}
                    </p>
                </div>
            </div>

            {!submission && isLoading ? (
                <p className="mt-4 text-xs text-muted-foreground">Loading contact…</p>
            ) : null}
        </div>
    );
};

export default ListingSubmissionContactDetails;

