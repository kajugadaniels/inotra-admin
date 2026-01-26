import {
    CalendarCheck,
    CreditCard,
    FileText,
    LayoutGrid,
    Layers,
    LineChart,
    MapPin,
    Megaphone,
    Image,
    PartyPopper,
    Ticket,
    TicketCheck,
    UserCog,
    Users,
    type LucideIcon,
} from "lucide-react";

export type SidebarLink = {
    label: string;
    icon: LucideIcon;
    href?: string;
    children?: SidebarLink[];
};

export const adminSidebarLinks: SidebarLink[] = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutGrid,
    },
    {
        label: "Analytics",
        href: "/analytics",
        icon: LineChart,
    },
    {
        label: "Admins",
        href: "/admins",
        icon: Users,
    },
    {
        label: "Users",
        href: "/users",
        icon: UserCog,
    },
    {
        label: "Places",
        href: "/places",
        icon: MapPin,
    },
    {
        label: "Events",
        href: "/events",
        icon: PartyPopper,
    },
    {
        label: "Bookings",
        href: "/bookings",
        icon: CalendarCheck,
    },
    {
        label: "Tickets",
        href: "/tickets",
        icon: TicketCheck,
    },
    {
        label: "Payments",
        href: "/payments",
        icon: CreditCard,
    },
    {
        label: "Reports",
        href: "/reports",
        icon: FileText,
    },
    {
        label: "Ads",
        icon: Megaphone,
        children: [
            {
                label: "Ad Placements",
                href: "/ads/placements",
                icon: Layers,
            },
            {
                label: "Ad Creatives",
                href: "/ads/creatives",
                icon: Image,
            },
        ],
    },
];
