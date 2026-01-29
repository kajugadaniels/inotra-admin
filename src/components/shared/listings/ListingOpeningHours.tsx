import { Textarea } from "@/components/ui/textarea";

type ListingOpeningHoursProps = {
    form: ListingFormState;
    onChange: (next: ListingFormState) => void;
    disabled?: boolean;
};

const ListingOpeningHours = ({ form, onChange, disabled }: ListingOpeningHoursProps) => {
    return (
        <div>
            <label className="text-sm">Opening hours (JSON format, optional)</label>
            <Textarea
                value={form.openingHours}
                onChange={(e) => onChange({ ...form, openingHours: e.target.value })}
                placeholder='{"mon":{"open":"08:00","close":"18:00"}}'
                className="mt-2 min-h-[30px] rounded-lg"
                disabled={disabled}
            />
        </div>
    );
};

export default ListingOpeningHours;
