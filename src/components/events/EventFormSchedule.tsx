"use client";

import { Input } from "@/components/ui/input";
import ListingMap from "@/components/shared/listings/ListingMap";
import type { EventFormState } from "./EventForm";

type Props = {
    form: EventFormState;
    setForm: (next: EventFormState) => void;
};

const EventFormSchedule = ({ form, setForm }: Props) => (
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
            <ListingMap
                latitude={form.latitude}
                longitude={form.longitude}
                onLocationSelect={(lat, lng) => setForm({ ...form, latitude: lat, longitude: lng })}
            />
        </div>
    </div>
);

export default EventFormSchedule;
