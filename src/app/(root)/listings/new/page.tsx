"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authStorage } from "@/api/auth";
import { createPlace, listPlaceCategories } from "@/api/places";
import type { PlaceCategory } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import { Button } from "@/components/ui/button";
import {
    ListingForm,
    createDefaultOpeningHours,
    serializeOpeningHours,
    type ListingFormState,
} from "@/components/shared/listings";

const DEFAULT_FORM: ListingFormState = {
    name: "",
    categoryId: "",
    description: "",
    address: "",
    city: "",
    country: "Rwanda",
    latitude: "",
    longitude: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    openingHours: createDefaultOpeningHours(),
    is_verified: false,
    is_active: true,
    images: [],
    removeImageIds: [],
    services: [],
};

const NewListingPage = () => {
    const router = useRouter();
    const [form, setForm] = useState<ListingFormState>(DEFAULT_FORM);
    const [categories, setCategories] = useState<PlaceCategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access) return;

        listPlaceCategories({ apiBaseUrl, accessToken: tokens.access })
            .then((result) => {
                if (result.ok && result.body) {
                    setCategories(result.body);
                }
            })
            .catch(() => {
                // non-blocking
            });
    }, [apiBaseUrl]);

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            toast.error("Listing name required", {
                description: "Provide a name for the listing.",
            });
            return;
        }
        if (form.services.length === 0 || form.services.some((service) => !service.name.trim())) {
            toast.error("Listing services required", {
                description: "Add at least one service with a valid name.",
            });
            return;
        }

        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to create listings.",
            });
            return;
        }

        const opening_hours = serializeOpeningHours(form.openingHours);

        setIsLoading(true);
        try {
            const result = await createPlace({
                apiBaseUrl,
                accessToken: tokens.access,
                data: {
                    name: form.name.trim(),
                    category: form.categoryId || undefined,
                    description: form.description.trim() || undefined,
                    address: form.address.trim() || undefined,
                    city: form.city.trim() || undefined,
                    country: form.country.trim() || undefined,
                    latitude: form.latitude ? Number(form.latitude) : undefined,
                    longitude: form.longitude ? Number(form.longitude) : undefined,
                    phone: form.phone.trim() || undefined,
                    whatsapp: form.whatsapp.trim() || undefined,
                    email: form.email.trim() || undefined,
                    website: form.website.trim() || undefined,
                    opening_hours,
                    is_verified: form.is_verified,
                    is_active: form.is_active,
                    images: form.images,
                    services: form.services.map((service) => ({
                        name: service.name.trim(),
                        is_available: service.is_available,
                    })),
                },
            });

            if (!result.ok || !result.body?.place) {
                toast.error("Listing creation failed", {
                    description: result.body?.message ?? "Please review the form and retry.",
                });
                return;
            }

            toast.success("Listing created", {
                description: result.body?.message ?? "Listing created successfully.",
            });
            router.push("/listings");
        } catch (error) {
            toast.error("Listing creation failed", {
                description:
                    error instanceof Error
                        ? error.message
                        : "Check API connectivity and try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">New listing</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Add a new listing to the platform inventory.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => router.push("/listings")}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="rounded-full"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        Create listing
                    </Button>
                </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <ListingForm
                    form={form}
                    categories={categories}
                    disabled={isLoading}
                    onChange={setForm}
                    onImagesChange={(files) => setForm({ ...form, images: files })}
                />
            </div>
        </div>
    );
};

export default NewListingPage;
