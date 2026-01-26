import type { RefObject } from "react";

import { cn } from "@/lib/utils";

export type AdminGoogleSignInProps = {
    isBusy: boolean;
    signInRef: RefObject<HTMLDivElement | null>;
};

const AdminGoogleSignIn = ({ isBusy, signInRef }: AdminGoogleSignInProps) => {
    return (
        <div className="mt-6 space-y-3">
            <div
                className={cn(
                    "rounded-2xl bg-background/55 p-4 backdrop-blur",
                    isBusy ? "pointer-events-none opacity-70" : ""
                )}
            >
                <div className="flex justify-start">
                    <div
                        ref={signInRef}
                        className={cn("min-h-[48px]", isBusy ? "pointer-events-none opacity-70" : "")}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminGoogleSignIn;
