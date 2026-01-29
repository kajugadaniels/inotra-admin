type StepMeta = {
    key: string;
    label: string;
    description?: string;
};

type ListingFormSidebarProps = {
    steps: StepMeta[];
    activeIndex: number;
    onStepChange: (index: number) => void;
};

const ListingFormSidebar = ({
    steps,
    activeIndex,
    onStepChange,
}: ListingFormSidebarProps) => {
    return (
        <aside className="hidden h-full rounded-3xl border border-border/60 bg-background/60 p-5 md:block">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Listing setup
            </p>
            <div className="mt-6 space-y-2">
                {steps.map((step, index) => {
                    const isActive = index === activeIndex;
                    const isComplete = index < activeIndex;
                    return (
                        <button
                            key={step.key}
                            type="button"
                            onClick={() => onStepChange(index)}
                            className={`flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                                isActive
                                    ? "border-primary/60 bg-primary/10"
                                    : "border-border/60 bg-background/80"
                            }`}
                            aria-current={isActive ? "step" : undefined}
                        >
                            <span
                                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
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
        </aside>
    );
};

export default ListingFormSidebar;
