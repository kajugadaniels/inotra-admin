import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import ListingMap from "./ListingMap";
import type { ListingFormState } from "./ListingForm";

type ListingLocationInfoProps = {
    form: ListingFormState;
    disabled?: boolean;
    onChange: (next: ListingFormState) => void;
};

const ListingLocationInfo = ({
    form,
    disabled = false,
    onChange,
}: ListingLocationInfoProps) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? "";

    if (!apiKey) {
        return (
            <div className="rounded-3xl border border-border/60 bg-background/60 p-5 text-sm text-muted-foreground">
                Google Maps key is missing. Add NEXT_PUBLIC_GOOGLE_MAP_API_KEY in admin/.env to enable map and address autocomplete.
            </div>
        );
    }

    return (
        <APIProvider apiKey={apiKey}>
            <ListingLocationContent
                form={form}
                disabled={disabled}
                onChange={onChange}
            />
        </APIProvider>
    );
};

export default ListingLocationInfo;

const ListingLocationContent = ({
    form,
    disabled = false,
    onChange,
}: ListingLocationInfoProps) => {
    const addressRef = useRef<HTMLInputElement | null>(null);
    const formRef = useRef(form);
    const placesLib = useMapsLibrary("places");

    useEffect(() => {
        formRef.current = form;
    }, [form]);

    useEffect(() => {
        if (!placesLib || !addressRef.current) return;

        const autocomplete = new placesLib.Autocomplete(addressRef.current, {
            fields: ["formatted_address", "geometry", "address_components"],
            types: ["geocode"],
        });

        const listener = autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            const current = formRef.current;
            const updates: Partial<ListingFormState> = {};

            if (place.formatted_address) {
                updates.address = place.formatted_address;
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
                onChange({ ...current, ...updates });
            }
        });

        return () => {
            listener.remove();
        };
    }, [placesLib, onChange]);

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Address (optional)
                    </label>
                    <Input
                        ref={addressRef}
                        value={form.address}
                        onChange={(event) =>
                            onChange({ ...form, address: event.target.value })
                        }
                        placeholder="KG 123 St"
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                        Start typing to see Google address suggestions.
                    </p>
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        City (optional)
                    </label>
                    <Input
                        value={form.city}
                        onChange={(event) =>
                            onChange({ ...form, city: event.target.value })
                        }
                        placeholder="Kigali"
                        className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60"
                        disabled={disabled}
                    />
                </div>
            </div>

            <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Map picker (optional)
                </label>
                <p className="mt-2 text-xs text-muted-foreground">
                    Click on the map to pin the exact location. The latitude and longitude will update automatically.
                </p>
                <div className="mt-4">
                    <ListingMap
                        latitude={form.latitude}
                        longitude={form.longitude}
                        disabled={disabled}
                        onLocationSelect={(lat, lng) =>
                            onChange({ ...form, latitude: lat, longitude: lng })
                        }
                    />
                </div>
            </div>
        </div>
    );
};
