import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { ListingFormState } from "./ListingForm";

type ListingServicesProps = {
    form: ListingFormState;
    disabled?: boolean;
    onChange: (next: ListingFormState) => void;
};

const ListingServices = ({
    form,
    disabled = false,
    onChange,
}: ListingServicesProps) => {
    return (
        <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold text-foreground">
                        Listing services (required)
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Add the services or features available at this listing.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    className="rounded-full text-xs"
                    onClick={() =>
                        onChange({
                            ...form,
                            services: [
                                ...form.services,
                                { name: "", is_available: true },
                            ],
                        })
                    }
                    disabled={disabled}
                >
                    Add service
                </Button>
            </div>

            <div className="mt-4 space-y-3">
                {form.services.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                        No services yet. Add at least one service before saving.
                    </p>
                ) : (
                    form.services.map((service, index) => (
                        <div
                            key={index}
                            className="grid gap-3 rounded-2xl border border-border/60 bg-background/70 p-3 md:grid-cols-[1fr_auto_auto]"
                        >
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Service name (required)
                                </label>
                                <Input
                                    value={service.name}
                                    onChange={(event) => {
                                        const next = [...form.services];
                                        next[index] = {
                                            ...next[index],
                                            name: event.target.value,
                                        };
                                        onChange({ ...form, services: next });
                                    }}
                                    placeholder="Wi-Fi"
                                    className="admin-field mt-2 rounded-2xl border-border/60 bg-background/60 text-xs"
                                    disabled={disabled}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                    Available (optional)
                                </label>
                                <Select
                                    value={service.is_available ? "true" : "false"}
                                    onValueChange={(value) => {
                                        const next = [...form.services];
                                        next[index] = {
                                            ...next[index],
                                            is_available: value === "true",
                                        };
                                        onChange({ ...form, services: next });
                                    }}
                                    disabled={disabled}
                                >
                                    <SelectTrigger className="admin-field mt-2 w-full rounded-2xl border-border/60 bg-background/60 text-xs">
                                        <SelectValue placeholder="Availability" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Available</SelectItem>
                                        <SelectItem value="false">Unavailable</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full rounded-full text-xs uppercase tracking-[0.2em] text-white"
                                    onClick={() => {
                                        const next = form.services.filter(
                                            (_, idx) => idx !== index
                                        );
                                        onChange({ ...form, services: next });
                                    }}
                                    disabled={disabled}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ListingServices;
