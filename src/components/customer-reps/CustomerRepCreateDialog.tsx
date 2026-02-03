"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export type CustomerRepForm = {
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
};

type Props = {
    isLoading: boolean;
    onCreate: (data: CustomerRepForm, close: () => void, reset: () => void) => void;
};

const CustomerRepCreateDialog = ({ isLoading, onCreate }: Props) => {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<CustomerRepForm>({ email: "" });

    const reset = () => setForm({ email: "" });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-11 rounded-full" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New customer rep
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create customer representative</DialogTitle>
                    <DialogDescription>
                        Enter the contact information. A temporary password and OTP will be emailed to activate the account.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Email (required)
                        </label>
                        <Input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="rep@example.com"
                        />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                First name (optional)
                            </label>
                            <Input
                                value={form.first_name ?? ""}
                                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                                placeholder="Jane"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Last name (optional)
                            </label>
                            <Input
                                value={form.last_name ?? ""}
                                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                                placeholder="Doe"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Phone (optional)
                        </label>
                        <Input
                            value={form.phone ?? ""}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="+2507..."
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="h-11 rounded-full"
                        disabled={isLoading || !form.email.trim()}
                        onClick={() => onCreate(form, () => setOpen(false), reset)}
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Create rep
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CustomerRepCreateDialog;
