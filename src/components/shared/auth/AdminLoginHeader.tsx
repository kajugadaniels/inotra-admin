import { ShieldCheck } from "lucide-react";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

type AdminLoginHeaderProps = {
    badgeText?: string;
};

const AdminLoginHeader = ({
    badgeText = "Admin login",
}: AdminLoginHeaderProps) => {
    return (
        <div className="mb-8 flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {badgeText}
            </div>

            <div className="flex items-center gap-3">
                <AnimatedThemeToggler
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/70 text-foreground shadow-sm"
                />
            </div>
        </div>
    );
};

export default AdminLoginHeader;
