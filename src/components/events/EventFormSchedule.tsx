"use client";

import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";
import ListingMap from "@/components/shared/listings/ListingMap";
import type { EventFormState } from "./EventForm";

type Props = {
    form: EventFormState;
    setForm: (next: EventFormState) => void;
};

const EventFormSchedule = ({ form, setForm }: Props) => {
    const addressRef = useRef<HTMLInputElement | null>(null);
    const formRef = useRef(form);
    const placesLib = useMapsLibrary("places");

    useEffect(() => {
        formRef.current = form;
    }, [form]);

    useEffect(() => {
        if (!placesLib || !addressRef.current) return;

        const autocomplete = new placesLib.Autocomplete(addressRef.current, {
            fields: ["formatted_address", "geometry", "address_components", "name"],
            componentRestrictions: { country: "rw" },
            strictBounds: false,
        });

        const listener = autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            const current = formRef.current;
            const updates: Partial<EventFormState> = {};

            if (place.formatted_address) {
                updates.address = place.formatted_address;
            } else if (place.name) {
                updates.address = place.name;
            }

            if (place.geometry?.location) {
                updates.latitude = place.geometry.location.lat().toFixed(6);
                updates.longitude = place.geometry.location.lng().toFixed(6);
            }

            const components = place.address_components ?? [];
            const find = (type: string) =>
                components.find((component) => component.types.includes(type));

            const city = find("locality")?.long_name;
            const country = find("country")?.long_name;

            if (city) updates.city = city;
            if (country) updates.country = country;

            if (Object.keys(updates).length) {
                setForm({ ...current, ...updates });
            }
        });

        return () => listener.remove();
    }, [placesLib, setForm]);

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Start at (optional)
                </label>
                <Input
                    type="datetime-local"
                    value={form.start_at}
                    onChange={(e) => setForm({ ...form, start_at: e.target.value })}
                />
            </div>
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    End at (optional)
                </label>
                <Input
                    type="datetime-local"
                    value={form.end_at}
                    onChange={(e) => setForm({ ...form, end_at: e.target.value })}
                />
            </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Venue name (optional)
                </label>
                <Input
                    value={form.venue_name}
                    onChange={(e) => setForm({ ...form, venue_name: e.target.value })}
                    placeholder="Arena Kigali"
                />
            </div>
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Address (optional)
                </label>
                <Input
                    ref={addressRef}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="KG 123 St"
                />
                </div>
            </div>
        <div className="grid gap-4 md:grid-cols-2">
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    City (optional)
                </label>
                <Input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Kigali"
                />
            </div>
            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Country (optional)
                </label>
                <Input
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder="Rwanda"
                />
            </div>
        </div>

        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-foreground">Event location</p>
                    <p className="text-xs text-muted-foreground">
                        Click on the map to set coordinates (Rwanda only).
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <Input
                        value={form.latitude}
                        placeholder="Lat"
                        readOnly
                        className="h-8 text-xs"
                    />
                    <Input
                        value={form.longitude}
                        placeholder="Lng"
                        readOnly
                        className="h-8 text-xs"
                    />
                </div>
            </div>
            {process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ? (
                <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}>
                    <ListingMap
                        latitude={form.latitude}
                        longitude={form.longitude}
                        onLocationSelect={(lat, lng) =>
                            setForm({ ...form, latitude: lat, longitude: lng })
                        }
                    />
                </APIProvider>
            ) : (
                <div className="rounded-3xl border border-dashed border-border/60 bg-background/60 p-4 text-sm text-muted-foreground">
                    Set NEXT_PUBLIC_GOOGLE_MAP_API_KEY in .env to enable map selection.
                </div>
            )}
        </div>
        </div>
    );
};

export default EventFormSchedule;
