"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = {
    children: ReactNode;
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="inotra-theme"
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
};

export default ThemeProvider;