"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { authStorage, changeAdminPassword, updateAdminProfile } from "@/api/auth";
import type { AdminUser } from "@/api/types";
import { getApiBaseUrl } from "@/config/api";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
    AdminPasswordForm,
    AdminProfileDetailsForm,
    AdminProfileHeader,
    AdminProfileTabs,
} from "@/components/shared/profile";

const AdminProfilePage = () => {
    const [isProfileBusy, setIsProfileBusy] = useState(false);
    const [isPasswordBusy, setIsPasswordBusy] = useState(false);
    const [user, setUser] = useState<AdminUser | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

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

        setIsProfileBusy(true);
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
            setIsProfileBusy(false);
        }
    };

    const userLabel = user?.name || user?.email || "Admin";
    const userInitial = userLabel.slice(0, 1).toUpperCase();

    const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const tokens = authStorage.getTokens();
        if (!tokens?.access) {
            toast.error("Session missing", {
                description: "Sign in again to update your password.",
            });
            return;
        }

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Missing details", {
                description: "Enter your current and new password to continue.",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match", {
                description: "Please confirm the new password again.",
            });
            return;
        }

        const loadingId = toast.loading("Updating password", {
            description: "Verifying credentials...",
        });

        setIsPasswordBusy(true);
        try {
            const result = await changeAdminPassword({
                apiBaseUrl,
                accessToken: tokens.access,
                current_password: currentPassword,
                new_password: newPassword,
                confirm_new_password: confirmPassword,
            });

            if (!result.ok) {
                toast.error("Update failed", {
                    id: loadingId,
                    description: result.body?.message ?? "Unable to update password.",
                });
                return;
            }

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            toast.success("Password updated", {
                id: loadingId,
                description: "Use your new password next time you sign in.",
            });
        } catch (error) {
            toast.error("Update failed", {
                id: loadingId,
                description:
                    error instanceof Error ? error.message : "Check API connectivity and try again.",
            });
        } finally {
            setIsPasswordBusy(false);
        }
    };

    return (
        <div className="relative space-y-8">
            {/* premium ambient header glow */}
            <div className="pointer-events-none absolute -top-10 left-1/2 h-40 w-[680px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

            {/* Hero / Header Card */}
            <AdminProfileHeader
                userLabel={userLabel}
                userInitial={userInitial}
                imagePreview={imagePreview}
                userImage={user?.image}
                isBusy={isProfileBusy}
                onImageChange={setImageFile}
            />

            <Tabs defaultValue="profile" orientation="vertical" className="gap-6 lg:flex">
                <AdminProfileTabs className="w-full lg:w-64" />

                <div className="flex-1 space-y-6">
                    <TabsContent value="profile">
                        <AdminProfileDetailsForm
                            name={name}
                            username={username}
                            email={user?.email ?? ""}
                            phoneNumber={phoneNumber}
                            isBusy={isProfileBusy}
                            onNameChange={setName}
                            onUsernameChange={setUsername}
                            onPhoneChange={setPhoneNumber}
                            onSubmit={handleSubmit}
                        />
                    </TabsContent>

                    <TabsContent value="password">
                        <AdminPasswordForm
                            currentPassword={currentPassword}
                            newPassword={newPassword}
                            confirmPassword={confirmPassword}
                            isBusy={isPasswordBusy}
                            onCurrentPasswordChange={setCurrentPassword}
                            onNewPasswordChange={setNewPassword}
                            onConfirmPasswordChange={setConfirmPassword}
                            onSubmit={handlePasswordChange}
                        />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default AdminProfilePage;
