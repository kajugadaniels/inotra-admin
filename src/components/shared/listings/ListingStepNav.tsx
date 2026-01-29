type StepMeta = {
    key: string;
    label: string;
    description?: string;
};

type ListingStepNavProps = {
    steps: StepMeta[];
    activeIndex: number;
    onStepChange: (index: number) => void;
};

const ListingStepNav = ({
    steps,
    activeIndex,
    onStepChange,
}: ListingStepNavProps) => {
    return (
        <div className="flex flex-wrap gap-3">
            {steps.map((step, index) => {
                const isActive = index === activeIndex;
                const isComplete = index < activeIndex;
                return (
                    <button
                        key={step.key}
                        type="button"
                        onClick={() => onStepChange(index)}
                        className={`flex items-center gap-3 rounded-full border px-4 py-2 text-left transition ${
                            isActive
                                ? "border-primary/70 bg-primary/10"
                                : "border-border/60 bg-background/60"
                        }`}
                        aria-current={isActive ? "step" : undefined}
                    >
                        <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                                isComplete
                                    ? "bg-primary text-primary-foreground"
                                    : isActive
                                        ? "bg-primary/80 text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                            }`}
                        >
                            {index + 1}
                        </span>
                        <span className="flex flex-col">
                            <span className="text-xs font-semibold text-foreground">
                                {step.label}
                            </span>
                            {step.description ? (
                                <span className="text-[11px] text-muted-foreground">
                                    {step.description}
                                </span>
                            ) : null}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default ListingStepNav;
