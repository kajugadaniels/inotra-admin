import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import ThemeProvider from "@/components/shared/theme-provider";
import "./globals.css";

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
                className="font-sans antialiased"
            >
                <ThemeProvider>
                    <Toaster position="top-right" richColors closeButton />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
