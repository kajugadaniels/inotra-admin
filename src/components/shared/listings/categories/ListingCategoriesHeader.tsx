import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type ListingCategoriesHeaderProps = {
    isLoading: boolean;
    onCreate: () => void;
};

const ListingCategoriesHeader = ({ isLoading, onCreate }: ListingCategoriesHeaderProps) => (
    <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-semibold text-foreground">Listing categories</h1>
            <p className="mt-1 text-sm text-muted-foreground">
                Manage the categories used to organize listings.
            </p>
        </div>
        <Button
            type="button"
            className="rounded-full"
            onClick={onCreate}
            disabled={isLoading}
        >
            <Plus className="mr-2 h-4 w-4" />
            New category
        </Button>
    </div>
);

export default ListingCategoriesHeader;
