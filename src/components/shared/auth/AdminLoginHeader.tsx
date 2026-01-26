import { Moon, ShieldCheck, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

type AdminLoginHeaderProps = {
    isDark: boolean;
    isMounted: boolean;
    onToggleTheme: () => void;
    badgeText?: string;
};

const AdminLoginHeader = ({
    isDark,
    isMounted,
    onToggleTheme,
    badgeText = "Admin login",
}: AdminLoginHeaderProps) => {
    return (
        <div className="mb-8 flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {badgeText}
            </div>

            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full border-border/60 bg-background/70"
                    onClick={onToggleTheme}
                    aria-label={
                        isMounted
                            ? `Switch to ${isDark ? "light" : "dark"} mode`
                            : "Toggle color theme"
                    }
                >
                    {isMounted && isDark ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    );
};

export default AdminLoginHeader;
