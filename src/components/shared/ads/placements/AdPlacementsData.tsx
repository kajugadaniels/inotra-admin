"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { listAdPlacements } from "@/api/ads";
import type { AdPlacement } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";

type AdPlacementsDataContextValue = {
    placements: AdPlacement[];
    setPlacements: React.Dispatch<React.SetStateAction<AdPlacement[]>>;
    isLoading: boolean;
    refresh: () => Promise<void>;
};

const AdPlacementsDataContext = createContext<AdPlacementsDataContextValue | null>(null);

export const useAdPlacementsData = () => {
    const context = useContext(AdPlacementsDataContext);
    if (!context) {
        throw new Error("useAdPlacementsData must be used within AdPlacementsDataProvider");
    }
    return context;
};

type AdPlacementsDataProviderProps = {
    children: React.ReactNode;
};

const AdPlacementsDataProvider = ({ children }: AdPlacementsDataProviderProps) => {
    const [placements, setPlacements] = useState<AdPlacement[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    const refresh = useCallback(async () => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to access placements.",
            });
            return;
        }

        setIsLoading(true);
        try {
            const result = await listAdPlacements({
                apiBaseUrl,
                accessToken: tokens.access,
            });

            if (!result.ok || !result.body) {
                toast.error("Unable to load placements", {
                    description: "Please try again.",
                });
                return;
            }

            setPlacements(result.body);
        } catch (error) {
            toast.error("Unable to load placements", {
                description:
                    error instanceof Error
                        ? error.message
                        : "Check API connectivity and try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }, [apiBaseUrl]);

    useEffect(() => {
        void refresh();
    }, [apiBaseUrl, refresh]);

    const value = useMemo(
        () => ({ placements, setPlacements, isLoading, refresh }),
        [placements, isLoading, refresh]
    );

    return (
        <AdPlacementsDataContext.Provider value={value}>
            {children}
        </AdPlacementsDataContext.Provider>
    );
};

export default AdPlacementsDataProvider;
