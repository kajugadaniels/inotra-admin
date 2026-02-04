import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import ThemeProvider from "@/components/shared/theme-provider";
import "./globals.css";

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
    display: "swap",
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
                className={`${dmSans.variable} antialiased`}
            >
                <ThemeProvider>
                    <Toaster position="top-right" richColors closeButton />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
