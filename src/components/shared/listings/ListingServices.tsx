import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";

type ListingServicesProps = {
    form: ListingFormState;
    onChange: (next: ListingFormState) => void;
    disabled?: boolean;
};

const ListingServices = ({ form, onChange, disabled }: ListingServicesProps) => {
    return (
        <div className="space-y-4">
            {form.services.map((service, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="text-sm">Service name (required)</label>
                        <Input
                            value={service.name}
                            onChange={(e) => {
                                const next = [...form.services];
                                next[index] = { ...next[index], name: e.target.value };
                                onChange({ ...form, services: next });
                            }}
                            placeholder="Wi-Fi"
                            className="mt-2 rounded-lg"
                            disabled={disabled}
                        />
                    </div>
                    <div>
                        <label className="text-sm">Available (optional)</label>
                        <Select
                            value={service.is_available ? "true" : "false"}
                            onValueChange={(value) => {
                                const next = [...form.services];
                                next[index] = { ...next[index], is_available: value === "true" };
                                onChange({ ...form, services: next });
                            }}
                            disabled={disabled}
                        >
                            <SelectTrigger className="mt-2 w-full rounded-lg">
                                <SelectValue placeholder="Availability" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Available</SelectItem>
                                <SelectItem value="false">Unavailable</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListingServices;
