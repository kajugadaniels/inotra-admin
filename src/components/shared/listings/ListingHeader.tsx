import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type ListingHeaderProps = {
    isLoading: boolean;
};

const ListingHeader = ({ isLoading }: ListingHeaderProps) => (
    <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-semibold text-foreground">Listings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
                Manage listing inventory and keep category details up to date.
            </p>
        </div>
        <Button asChild className="rounded-full" disabled={isLoading}>
            <Link href="/listings/new">
                <Plus className="mr-2 h-4 w-4" />
                New listing
            </Link>
        </Button>
    </div>
);

export default ListingHeader;
