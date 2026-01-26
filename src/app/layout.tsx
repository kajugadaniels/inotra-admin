import type { Metadata } from "next";
import { Urbanist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import ThemeProvider from "@/components/shared/theme-provider";
import "./globals.css";

const geistSans = Urbanist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "INOTRA Admin Portal",
    description:
        "Manage INOTRA operations, users, and content in the secure admin portal.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                suppressHydrationWarning
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider>
                    <Toaster position="top-right" richColors closeButton />
                    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,#f7f2ec_0%,#f6f7fb_45%,#eef1f6_100%)] text-foreground dark:bg-[radial-gradient(circle_at_top,#2a2520_0%,#121113_42%,#0b0b0c_100%)]">
                        <div className="pointer-events-none absolute left-1/2 top-[-200px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
                        <div className="pointer-events-none absolute right-[-120px] top-[160px] h-[220px] w-[220px] rounded-full bg-secondary/20 blur-[120px]" />
                        {children}
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}