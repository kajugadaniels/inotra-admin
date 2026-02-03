"use client";

import { MoreHorizontal, Eye, Edit3, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
    disabled?: boolean;
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    align?: "start" | "center" | "end";
};

const HighlightActionsMenu = ({ disabled, onView, onEdit, onDelete, align = "end" }: Props) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-black/35 text-white hover:bg-black/45"
                    disabled={disabled}
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align={align}
                className="w-44"
                onClick={(e) => e.stopPropagation()}
            >
                <DropdownMenuItem onClick={onView} disabled={!onView}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onEdit} disabled={!onEdit}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={onDelete}
                    disabled={!onDelete}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default HighlightActionsMenu;
