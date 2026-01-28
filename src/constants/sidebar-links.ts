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
    VanIcon,
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
        label: "Accounts",
        icon: Users,
        children: [
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
        ],
    },
    {
        label: "Trip Packages",
        href: "/trip-packages",
        icon: VanIcon,
    },
    {
        label: "Listings",
        icon: MapPin,
        children: [
            {
                label: "Listing Categories",
                href: "/listings/categories",
                icon: Layers,
            },
            {
                label: "Listings",
                href: "/listings",
                icon: MapPin,
            },
            {
                label: "Listing Requests",
                href: "/listings/requests",
                icon: FileText,
            },
            {
                label: "Listing Reservations",
                href: "/listings/reservations",
                icon: CalendarCheck,
            },
        ],
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
