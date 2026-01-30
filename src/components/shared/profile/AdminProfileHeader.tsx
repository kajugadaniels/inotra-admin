import { Camera, ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AdminProfileHeaderProps = {
    userLabel: string;
    userInitial: string;
    imagePreview: string | null;
    userImage?: string | null;
    isBusy: boolean;
    onImageChange: (file: File | null) => void;
};

const AdminProfileHeader = ({
    userLabel,
    userInitial,
    imagePreview,
    userImage,
    isBusy,
    onImageChange,
}: AdminProfileHeaderProps) => {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(900px_circle_at_15%_10%,hsl(var(--primary)/0.14),transparent_55%),radial-gradient(700px_circle_at_85%_0%,hsl(var(--foreground)/0.06),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/70 to-transparent" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Profile
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
                        Admin profile
                    </h1>
                    <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground">
                        Keep your contact details and avatar up to date. Changes apply immediately across the admin workspace.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar className="h-16 w-16 ring-1 ring-border/60 sm:h-20 sm:w-20">
                            <AvatarImage src={imagePreview ?? userImage ?? ""} alt={userLabel} />
                            <AvatarFallback className="text-lg font-semibold">{userInitial}</AvatarFallback>
                        </Avatar>

                        <label
                            htmlFor="avatar-upload"
                            className="absolute -bottom-1 -right-1 grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-border/60 bg-background/70 text-foreground shadow-lg backdrop-blur transition hover:bg-background"
                            title="Change avatar"
                        >
                            <Camera className="h-4 w-4" />
                        </label>

                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) =>
                                onImageChange(event.target.files ? event.target.files[0] : null)
                            }
                            disabled={isBusy}
                        />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-foreground">{userLabel}</p>
                        <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Administrator
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfileHeader;
