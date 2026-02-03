import { Mail, Phone, Trash2, UserCheck, UserX } from "lucide-react";

import type { AdminUser } from "@/api/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const formatDate = (value?: string | null) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
};

type Props = {
    reps: AdminUser[];
    isLoading: boolean;
    busyId?: string | null;
    onToggleActive?: (user: AdminUser) => void;
    onDelete?: (user: AdminUser) => void;
};

const CustomerRepTable = ({ reps, isLoading, busyId, onToggleActive, onDelete }: Props) => {
    return (
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Representative</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="w-16 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-xs text-muted-foreground">
                                Loading customer reps...
                            </TableCell>
                        </TableRow>
                    ) : reps.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-xs text-muted-foreground">
                                No customer reps found for the selected filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        reps.map((user) => {
                            const label = user.name || user.username || user.email || "User";
                            const initial = label.slice(0, 1).toUpperCase();
                            const active = user.is_active ?? false;

                            return (
                                <TableRow key={user.id ?? `${user.email}-${label}`}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.image ?? ""} alt={label} />
                                                <AvatarFallback className="text-xs font-semibold">
                                                    {initial}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="truncate text-xs font-semibold text-foreground">
                                                    {label}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.username ?? "--"}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Mail className="h-4 w-4" />
                                            {user.email ?? "--"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Phone className="h-4 w-4" />
                                            {user.phone_number ?? "--"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                                                {active ? (
                                                    <UserCheck className="h-3.5 w-3.5 text-primary" />
                                                ) : (
                                                    <UserX className="h-3.5 w-3.5 text-muted-foreground" />
                                                )}
                                                {active ? "Active" : "Inactive"}
                                            </div>
                                            <Switch
                                                checked={!!active}
                                                disabled={busyId === user.id}
                                                onCheckedChange={() => onToggleActive?.(user)}
                                                className="data-[state=checked]:bg-primary"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {formatDate(user.date_joined)}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full text-destructive"
                                            onClick={() => onDelete?.(user)}
                                            disabled={busyId === user.id}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default CustomerRepTable;
