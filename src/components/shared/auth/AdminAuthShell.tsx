import type { ReactNode } from "react";

import AdminHeroPanel from "./AdminHeroPanel";
import AdminMobileHero from "./AdminMobileHero";

export type AdminAuthShellProps = {
    children: ReactNode;
};

const AdminAuthShell = ({ children }: AdminAuthShellProps) => {
    return (
        <div className="relative min-h-[calc(100vh-0px)] overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
                <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-primary/15 blur-3xl" />
                <div className="absolute -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:18px_18px]" />
            </div>

            <div className="mx-auto flex min-h-screen max-w-6xl items-stretch px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid w-full overflow-hidden rounded-3xl border border-border/60 bg-card/50 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.65)] backdrop-blur-xl lg:grid-cols-2">
                    <AdminHeroPanel />
                    <AdminMobileHero />

                    <section className="relative flex flex-col justify-center p-7 sm:p-10">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminAuthShell;
