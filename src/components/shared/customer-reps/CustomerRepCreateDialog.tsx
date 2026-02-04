"use client";

import { useEffect, useState } from "react";
import { Loader2, UploadCloudIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export type CustomerRepForm = {
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isLoading: boolean;
    onCreate: (data: CustomerRepForm, close: () => void, reset: () => void) => void;
};

const CustomerRepCreateDialog = ({ open, onOpenChange, isLoading, onCreate }: Props) => {
    const [form, setForm] = useState<CustomerRepForm>({ email: "" });

    const reset = () => setForm({ email: "" });

    useEffect(() => {
        // Safety: when dialog closes, reset form to avoid stale data next time
        if (!open) reset();
    }, [open]);

    const close = () => onOpenChange(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create customer representative</DialogTitle>
                    <DialogDescription>
                        Enter the contact information. A temporary password and OTP will be emailed
                        to activate the account.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Email (required)
                        </label>
                        <Input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="rep@example.com"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                First name (optional)
                            </label>
                            <Input
                                value={form.first_name ?? ""}
                                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                                placeholder="Jane"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Last name (optional)
                            </label>
                            <Input
                                value={form.last_name ?? ""}
                                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                                placeholder="Doe"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Phone (optional)
                        </label>
                        <Input
                            value={form.phone ?? ""}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="+2507..."
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full text-xs uppercase font-bold"
                        onClick={close}
                        disabled={isLoading}
                    >
                        <XIcon className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        className="h-11 rounded-full text-xs uppercase font-bold"
                        disabled={isLoading || !form.email.trim()}
                        onClick={() => onCreate(form, close, reset)}
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <UploadCloudIcon className="mr-2 h-4 w-4" />
                        )}
                        Create rep
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CustomerRepCreateDialog;
