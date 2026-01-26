"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, Mail, Phone, User, UserCircle } from "lucide-react";
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
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");

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
        setCountry(storedUser?.country ?? "");
        setCity(storedUser?.city ?? "");
    }, []);

    useEffect(() => {
        if (!imageFile) {
            setImagePreview(null);
            return;
        }
        const url = URL.createObjectURL(imageFile);
        setImagePreview(url);
        return () => {
            URL.revokeObjectURL(url);
        };
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
        if (country.trim()) formData.append("country", country.trim());
        if (city.trim()) formData.append("city", city.trim());
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

            toast.success("Profile updated", {
                id: loadingId,
                description: "Your admin profile was updated successfully.",
            });
        } catch (error) {
            toast.error("Update failed", {
                id: loadingId,
                description:
                    error instanceof Error
                        ? error.message
                        : "Check API connectivity and try again.",
            });
        } finally {
            setIsBusy(false);
        }
    };

    const userLabel = user?.name || user?.email || "Admin";
    const userInitial = userLabel.slice(0, 1).toUpperCase();

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-xl backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            Profile
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold text-foreground">Admin profile</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Keep your contact details and avatar up to date.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-16 w-16">
                                <AvatarImage
                                    src={imagePreview ?? user?.image ?? ""}
                                    alt={userLabel}
                                />
                                <AvatarFallback className="text-lg font-semibold">
                                    {userInitial}
                                </AvatarFallback>
                            </Avatar>
                            <label
                                htmlFor="avatar-upload"
                                className="absolute -bottom-1 -right-1 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-primary text-primary-foreground shadow-lg"
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
                        <div>
                            <p className="text-sm font-semibold text-foreground">{userLabel}</p>
                            <p className="text-xs text-muted-foreground">Administrator</p>
                        </div>
                    </div>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-xl backdrop-blur"
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Full name
                        </label>
                        <div className="relative">
                            <User className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Admin name"
                                className="pl-10"
                                disabled={isBusy}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Username
                        </label>
                        <div className="relative">
                            <UserCircle className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                placeholder="admin.username"
                                className="pl-10"
                                disabled={isBusy}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Email (read only)
                        </label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={user?.email ?? ""}
                                readOnly
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Phone number
                        </label>
                        <div className="relative">
                            <Phone className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={phoneNumber}
                                onChange={(event) => setPhoneNumber(event.target.value)}
                                placeholder="+250..."
                                className="pl-10"
                                disabled={isBusy}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Country
                        </label>
                        <Input
                            value={country}
                            onChange={(event) => setCountry(event.target.value)}
                            placeholder="Country"
                            disabled={isBusy}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            City
                        </label>
                        <Input
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                            placeholder="City"
                            disabled={isBusy}
                        />
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                        Changes will be applied to your admin profile immediately.
                    </p>
                    <Button
                        type="submit"
                        disabled={isBusy}
                        className="h-11 rounded-full px-6"
                    >
                        {isBusy ? "Saving..." : "Save changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminProfilePage;
