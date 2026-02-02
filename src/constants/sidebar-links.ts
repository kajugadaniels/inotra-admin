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
    TicketCheck,
    MessageCircle,
    UserCog,
    Users,
    type LucideIcon,
    VanIcon,
    UserStar,
    StarsIcon,
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
        label: "Users",
        icon: Users,
        children: [
            {
                label: "Admins",
                href: "/users/admins",
                icon: Users,
            },
            {
                label: "Customers",
                href: "/users/customers",
                icon: UserStar,
            },
            {
                label: "Customer Representatives",
                href: "/users/customer-representatives",
                icon: UserCog,
            },
        ],
    },
    {
        label: "Trips",
        icon: VanIcon,
        children: [
            {
                label: "Trip Packages",
                href: "/trip-packages",
                icon: VanIcon,
            },
            {
                label: "Quotations",
                href: "/quotations",
                icon: FileText,
            },
            {
                label: "Chats",
                href: "/chats",
                icon: MessageCircle,
            },
        ],
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
                label: "Listings Reviews",
                href: "/listings/reviews",
                icon: StarsIcon,
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
        icon: CalendarCheck,
        children: [
            {
                label: "Events",
                href: "/events",
                icon: PartyPopper,
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
        ],
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
