import { Lock, User } from "lucide-react";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type AdminProfileTabsProps = {
    className?: string;
};

const AdminProfileTabs = ({ className }: AdminProfileTabsProps) => {
    return (
        <div className={className}>
            <div className="rounded-3xl border border-border/60 bg-card/70 p-4 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    Settings
                </p>
                <TabsList variant="line" className="mt-4 w-full flex-col gap-2 bg-transparent">
                    <TabsTrigger
                        value="profile"
                        className="w-full justify-start gap-2 rounded-2xl px-3 py-2 text-xs data-[state=active]:bg-primary/10"
                    >
                        <User className="h-4 w-4" />
                        Profile details
                    </TabsTrigger>
                    <TabsTrigger
                        value="password"
                        className="w-full justify-start gap-2 rounded-2xl px-3 py-2 text-xs data-[state=active]:bg-primary/10"
                    >
                        <Lock className="h-4 w-4" />
                        Change password
                    </TabsTrigger>
                </TabsList>
            </div>
        </div>
    );
};

export default AdminProfileTabs;
