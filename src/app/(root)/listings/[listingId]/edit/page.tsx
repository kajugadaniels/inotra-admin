"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { authStorage, extractErrorDetail } from "@/api/auth";
import { getPlace, listPlaceCategories, updatePlace } from "@/api/places";
import type { PlaceCategory, PlaceDetail } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import {
    ListingForm,
    createDefaultOpeningHours,
    parseOpeningHours,
    serializeOpeningHours,
    type ListingFormState,
} from "@/components/shared/listings";

const emptyForm = (): ListingFormState => ({
    name: "",
    categoryId: "",
    description: "",
    logo: null,
    logoPreview: null,
    removeLogo: false,
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
});

const EditListingPage = () => {
    const router = useRouter();
    const params = useParams();
    const listingId = Array.isArray(params.listingId)
        ? params.listingId[0]
        : params.listingId;

    const [form, setForm] = useState<ListingFormState>(emptyForm());
    const [categories, setCategories] = useState<PlaceCategory[]>([]);
    const [existingImages, setExistingImages] = useState<PlaceDetail["images"]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        const tokens = authStorage.getTokens();
        if (!tokens?.access || !listingId) return;

        setIsLoading(true);
        Promise.all([
            getPlace({ apiBaseUrl, accessToken: tokens.access, placeId: listingId }),
            listPlaceCategories({ apiBaseUrl, accessToken: tokens.access }),
        ])
            .then(([placeResult, categoriesResult]) => {
                if (placeResult.ok && placeResult.body) {
                    const listing = placeResult.body;
                    setForm({
                        name: listing.name ?? "",
                        categoryId: listing.category_id ?? "",
                        description: listing.description ?? "",
                        logo: null,
                        logoPreview: listing.logo_url ?? null,
                        removeLogo: false,
                        address: listing.address ?? "",
                        city: listing.city ?? "",
                        country: listing.country ?? "",
                        latitude:
                            listing.latitude !== null && listing.latitude !== undefined
                                ? String(listing.latitude)
                                : "",
                        longitude:
                            listing.longitude !== null && listing.longitude !== undefined
                                ? String(listing.longitude)
                                : "",
                        phone: listing.phone ?? "",
                        whatsapp: listing.whatsapp ?? "",
                        email: listing.email ?? "",
                        website: listing.website ?? "",
                        openingHours: parseOpeningHours(listing.opening_hours),
                        is_verified: listing.is_verified ?? false,
                        is_active: listing.is_active ?? true,
                        logo: null,
                        logoPreview: listing.logo_url ?? null,
                        removeLogo: false,
                        images: [],
                        removeImageIds: [],
                        services:
                            listing.services?.map((service) => ({
                                name: service.name ?? "",
                                is_available: service.is_available ?? true,
                            })) ?? [],
                    });
                    setExistingImages(listing.images ?? []);
                } else {
                    toast.error("Unable to load listing", {
                        description: placeResult.body?.message ?? "Please try again.",
                    });
                }

                if (categoriesResult.ok && categoriesResult.body) {
                    setCategories(categoriesResult.body);
                }
            })
            .catch((error: Error) => {
                toast.error("Unable to load listing", {
                    description: error.message ?? "Check API connectivity and try again.",
                });
            })
            .finally(() => setIsLoading(false));
    }, [apiBaseUrl, listingId]);

    const handleSubmit = async () => {
        if (!listingId) return;
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
                description: "Sign in again to update listings.",
            });
            return;
        }

        const opening_hours = serializeOpeningHours(form.openingHours);

        setIsLoading(true);
        try {
            const result = await updatePlace({
                apiBaseUrl,
                accessToken: tokens.access,
                placeId: listingId,
                data: {
                    name: form.name.trim(),
                    category: form.categoryId || null,
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
                    remove_image_ids: form.removeImageIds,
                    images: form.images,
                    logo: form.logo || undefined,
                    remove_logo: form.removeLogo,
                    services: form.services.map((service) => ({
                        name: service.name.trim(),
                        is_available: service.is_available,
                    })),
                },
            });

            if (!result.ok || !result.body?.place) {
                const detail = extractErrorDetail(result.body);
                toast.error("Listing update failed", {
                    description: detail ?? "Please review the form and retry.",
                });
                return;
            }

            toast.success("Listing updated", {
                description: result.body?.message ?? "Listing updated successfully.",
            });
            router.push("/listings");
        } catch (error) {
            toast.error("Listing update failed", {
                description:
                    error instanceof Error
                        ? error.message
                        : "Check API connectivity and try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleRemoveImage = (imageId: string) => {
        const exists = form.removeImageIds.includes(imageId);
        setForm({
            ...form,
            removeImageIds: exists
                ? form.removeImageIds.filter((id) => id !== imageId)
                : [...form.removeImageIds, imageId],
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Edit listing</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update listing details, images, and availability.
                    </p>
                </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
                <ListingForm
                    form={form}
                    categories={categories}
                    existingImages={existingImages ?? []}
                    disabled={isLoading}
                    onChange={setForm}
                    onImagesChange={(files) => setForm({ ...form, images: files })}
                    onToggleRemoveImage={toggleRemoveImage}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default EditListingPage;
