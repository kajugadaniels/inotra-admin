import React from "react";

type ListingFormSidebarProps = {
    currentStep: number;
    steps: string[];
    onStepChange: (step: number) => void;
};

const ListingFormSidebar = ({ currentStep, steps, onStepChange }: ListingFormSidebarProps) => {
    return (
        <div className="w-64 p-4 bg-background/90 border-r border-border/60">
            <h3 className="text-xl font-semibold text-foreground">Form Steps</h3>
            <ul className="mt-4 space-y-3">
                {steps.map((step, index) => (
                    <li
                        key={index}
                        className={`cursor-pointer text-sm font-medium p-2 rounded-lg ${currentStep === index + 1 ? "bg-primary text-white" : "text-muted-foreground"
                            }`}
                        onClick={() => onStepChange(index + 1)}
                    >
                        Step {index + 1}: {step}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListingFormSidebar;
