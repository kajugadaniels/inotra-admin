"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, Mail, Phone, User, UserCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { authStorage, updateAdminProfile } from "@/api/auth";
import type { AdminUser } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DEFAULT_API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/superadmin";

const AdminProfilePage = () => {
    const [isBusy, setIsBusy] = useState(false);
    const [user, setUser] = useState<AdminUser | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const apiBaseUrl = useMemo(() => {
        const trimmed = DEFAULT_API_BASE_URL.trim();
        return trimmed.replace(/\/+$/, "");
    }, []);

    useEffect(() => {
        const storedUser = authStorage.getUser();
        setUser(storedUser);
        setName(storedUser?.name ?? "");
        setUsername(storedUser?.username ?? "");
        setPhoneNumber(storedUser?.phone_number ?? "");
    }, []);

    useEffect(() => {
        if (!imageFile) {
            setImagePreview(null);
            return;
        }
        const url = URL.createObjectURL(imageFile);
        setImagePreview(url);
        return () => URL.revokeObjectURL(url);
    }, [imageFile]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to update your profile.",
            });
            return;
        }

        const formData = new FormData();
        if (name.trim()) formData.append("name", name.trim());
        if (username.trim()) formData.append("username", username.trim());
        if (phoneNumber.trim()) formData.append("phone_number", phoneNumber.trim());
        if (imageFile) formData.append("avatar_url", imageFile);

        const loadingId = toast.loading("Updating profile", {
            description: "Saving your changes...",
        });

        setIsBusy(true);
        try {
            const result = await updateAdminProfile({
                apiBaseUrl,
                accessToken: tokens.access,
                data: formData,
            });

            if (!result.ok || !result.body?.user) {
                toast.error("Update failed", {
                    id: loadingId,
                    description: result.body?.message ?? "Unable to update profile.",
                });
                return;
            }

            const updatedUser = result.body.user;
            authStorage.setSession(tokens, updatedUser);
            setUser(updatedUser);
            setImageFile(null);
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("admin-profile-updated"));
            }

            toast.success("Profile updated", {
                id: loadingId,
                description: "Your admin profile was updated successfully.",
            });
        } catch (error) {
            toast.error("Update failed", {
                id: loadingId,
                description:
                    error instanceof Error ? error.message : "Check API connectivity and try again.",
            });
        } finally {
            setIsBusy(false);
        }
    };

    const userLabel = user?.name || user?.email || "Admin";
    const userInitial = userLabel.slice(0, 1).toUpperCase();

    return (
        <div className="relative space-y-8">
            {/* premium ambient header glow */}
            <div className="pointer-events-none absolute -top-10 left-1/2 h-40 w-[680px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

            {/* Hero / Header Card */}
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-8">
                <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(900px_circle_at_15%_10%,hsl(var(--primary)/0.14),transparent_55%),radial-gradient(700px_circle_at_85%_0%,hsl(var(--foreground)/0.06),transparent_55%)]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/70 to-transparent" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                            Profile
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
                            Admin profile
                        </h1>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                            Keep your contact details and avatar up to date. Changes apply immediately across the
                            admin workspace.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-16 w-16 ring-1 ring-border/60 sm:h-20 sm:w-20">
                                <AvatarImage src={imagePreview ?? user?.image ?? ""} alt={userLabel} />
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
                                    setImageFile(event.target.files ? event.target.files[0] : null)
                                }
                                disabled={isBusy}
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">{userLabel}</p>
                            <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Administrator
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-8"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Account details</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Edit your profile information. Email is read-only.
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    {/* Full name */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Full name
                        </label>
                        <div className="relative">
                            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Admin name"
                                disabled={isBusy}
                                className="h-12 rounded-2xl border-border/60 bg-background/60 pl-10 pr-4 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                            />
                            <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                        </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Username
                        </label>
                        <div className="relative">
                            <UserCircle className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                placeholder="admin.username"
                                disabled={isBusy}
                                className="h-12 rounded-2xl border-border/60 bg-background/60 pl-10 pr-4 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                            />
                            <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                        </div>
                    </div>

                    {/* Email (read only) */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Email (read only)
                        </label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={user?.email ?? ""}
                                readOnly
                                className="h-12 rounded-2xl border-border/60 bg-background/40 pl-10 pr-4 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                            />
                            <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Phone number
                        </label>
                        <div className="relative">
                            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={phoneNumber}
                                onChange={(event) => setPhoneNumber(event.target.value)}
                                placeholder="+250..."
                                disabled={isBusy}
                                className="h-12 rounded-2xl border-border/60 bg-background/60 pl-10 pr-4 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
                            />
                            <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                        </div>
                    </div>
                </div>

                {/* Footer actions */}
                <div className="mt-8 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                        Changes will be applied to your admin profile immediately.
                    </p>

                    <Button
                        type="submit"
                        disabled={isBusy}
                        className="h-12 rounded-2xl bg-primary px-7 text-primary-foreground shadow-lg shadow-primary/20 transition hover:shadow-xl hover:shadow-primary/25 sm:w-auto"
                    >
                        <span className="inline-flex items-center gap-2">
                            {isBusy ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                                    Saving...
                                </>
                            ) : (
                                <>Save changes</>
                            )}
                        </span>
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminProfilePage;
