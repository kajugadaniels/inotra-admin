import { useState } from "react";
import { Button } from "@/components/ui/button";
import ListingBasicInfo from "./ListingBasicInfo";
import ListingServices from "./ListingServices";
import ListingImages from "./ListingImages";
import ListingOpeningHours from "./ListingOpeningHours";

const ListingForm = ({
  form,
  categories,
  existingImages = [],
  disabled = false,
  onChange,
  onImagesChange,
  onToggleRemoveImage,
}: ListingFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="space-y-6">
      {currentStep === 1 && (
        <ListingBasicInfo
          form={form}
          categories={categories}
          disabled={disabled}
          onChange={onChange}
        />
      )}
      {currentStep === 2 && (
        <ListingServices form={form} onChange={onChange} disabled={disabled} />
      )}
      {currentStep === 3 && (
        <ListingImages
          form={form}
          existingImages={existingImages}
          disabled={disabled}
          onImagesChange={onImagesChange}
          onToggleRemoveImage={onToggleRemoveImage}
        />
      )}
      {currentStep === 4 && (
        <ListingOpeningHours form={form} onChange={onChange} disabled={disabled} />
      )}

      <div className="flex justify-between mt-4">
        {currentStep > 1 && (
          <Button onClick={handleBack} variant="outline" className="w-full rounded-2xl">
            Back
          </Button>
        )}
        {currentStep < 4 && (
          <Button onClick={handleNext} className="w-full rounded-2xl">
            Next
          </Button>
        )}
        {currentStep === 4 && (
          <Button type="submit" className="w-full rounded-2xl">
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default ListingForm;
