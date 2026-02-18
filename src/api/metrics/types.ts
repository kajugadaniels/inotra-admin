export type MetricsRange = {
    start_date: string;
    end_date: string;
    timezone: string;
};

export type MetricsByRoleRow = {
    role: string;
    total: number;
    active: number;
    inactive: number;
};

export type ListingsByCategoryRow = {
    category_id: string | null;
    category_name: string;
    category_icon: string | null;
    total: number;
    active: number;
    inactive: number;
    verified: number;
};

export type MetricsResponse = {
    range: MetricsRange;
    users: {
        total: number;
        by_role: MetricsByRoleRow[];
    };
    listings: {
        total: number;
        active: number;
        inactive: number;
        verified: number;
        unverified: number;
        by_category: ListingsByCategoryRow[];
    };
    events: {
        total: number;
        active: number;
        inactive: number;
        verified: number;
        unverified: number;
    };
    trip_packages: {
        total: number;
        active: number;
        inactive: number;
    };
    highlights: {
        total: number;
        likes_total: number;
        comments_total: number;
        shares_total: number;
    };
    chat: {
        threads: number;
        messages: number;
        messages_by_sender_type: { sender_type: string | null; total: number }[];
    };
    reviews: {
        place_reviews: {
            total: number;
            published: number | null;
            reported: number | null;
        };
        event_reviews: {
            total: number;
            published: number | null;
            reported: number | null;
        };
    };
    bookings: {
        total: number;
        by_status: { status: string | null; total: number }[];
    };
    submissions: {
        listing_submissions: {
            total: number;
            by_status: { status: string | null; total: number }[];
        };
        event_submissions: {
            total: number;
            by_status: { status: string | null; total: number }[];
        };
    };
};

