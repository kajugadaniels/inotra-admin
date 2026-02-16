"use client";

import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";
import AdminAuthGate from "@/components/shared/auth/AdminAuthGate";

type RootLayoutProps = {
    children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <AdminAuthGate>
            <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
                {/* Premium ambient background */}
                <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(1100px_circle_at_18%_8%,hsl(var(--primary)/0.10),transparent_55%),radial-gradient(900px_circle_at_85%_0%,hsl(var(--foreground)/0.06),transparent_55%)]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/70 to-transparent" />

                {/* Wider container + more breathing room */}
                <div className="relative mx-auto flex w-full max-w-[1660px] flex-col gap-6 px-4 pb-14 pt-6 sm:px-6 lg:px-10">
                    {/* Navbar gets a premium shell + sticky */}
                    <div className="sticky top-0 z-40">
                        <div className="rounded-3xl border border-border/60 bg-card/60 shadow-xl shadow-black/5 backdrop-blur-xl">
                            <Navbar onToggleSidebar={() => setIsSidebarOpen((open) => !open)} />
                        </div>
                    </div>

                    <div className="flex gap-6 lg:gap-8">
                        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                        {/* Content: bigger padding + bigger min height + premium surface */}
                        <section className="min-h-[calc(100vh-160px)] w-full flex-1 rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-8 lg:p-10">
                            {children}
                        </section>
                    </div>
                </div>
            </div>
        </AdminAuthGate>
    );
}
