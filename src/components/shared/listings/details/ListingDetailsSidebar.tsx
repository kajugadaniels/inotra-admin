import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type ListingDetailsTab = {
    key: string;
    label: string;
    description?: string;
};

type ListingDetailsSidebarProps = {
    tabs: ListingDetailsTab[];
};

const ListingDetailsSidebar = ({ tabs }: ListingDetailsSidebarProps) => {
    return (
        <aside className="hidden h-full rounded-3xl border border-border/60 bg-background/60 p-5 lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Listing details
            </p>
            <TabsList className="mt-6 w-full flex-col gap-2 bg-transparent p-0">
                {tabs.map((tab, index) => (
                    <TabsTrigger
                        key={tab.key}
                        value={tab.key}
                        className="flex w-full items-start gap-3 rounded-2xl border border-border/60 bg-background/80 px-3 py-3 text-left transition data-[state=active]:border-primary/60 data-[state=active]:bg-primary/10"
                    >
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            {index + 1}
                        </span>
                        <span className="flex flex-col">
                            <span className="text-xs font-semibold text-foreground">
                                {tab.label}
                            </span>
                            {tab.description ? (
                                <span className="text-[11px] text-muted-foreground">
                                    {tab.description}
                                </span>
                            ) : null}
                        </span>
                    </TabsTrigger>
                ))}
            </TabsList>
        </aside>
    );
};

export default ListingDetailsSidebar;
