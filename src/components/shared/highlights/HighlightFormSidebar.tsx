"use client";

type Step = { key: string; label: string };

type Props = {
    steps: Step[];
    activeStep: number;
};

const HighlightFormSidebar = ({ steps, activeStep }: Props) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-5 shadow-2xl shadow-black/5">
            <h3 className="text-sm font-semibold text-foreground">Steps</h3>
            <div className="mt-4 space-y-3">
                {steps.map((step, index) => {
                    const isActive = index === activeStep;
                    const isDone = index < activeStep;
                    return (
                        <div
                            key={step.key}
                            className={`flex items-center gap-3 rounded-2xl border px-3 py-2 text-sm ${
                                isActive
                                    ? "border-primary/40 bg-primary/5 text-foreground"
                                    : "border-border/60 bg-background/60 text-muted-foreground"
                            }`}
                        >
                            <span
                                className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : isDone
                                            ? "bg-emerald-500/15 text-emerald-600"
                                            : "bg-muted text-muted-foreground"
                                }`}
                            >
                                {isDone ? "✓" : index + 1}
                            </span>
                            <span className="truncate">{step.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HighlightFormSidebar;
