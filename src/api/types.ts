export type Tokens = {
    refresh: string;
    access: string;
};

export type AdminUser = {
    id?: string;
    email?: string | null;
    name?: string | null;
    username?: string | null;
    phone_number?: string | null;
    role?: string | null;
    image?: string | null;
    preferred_language?: string | null;
    preferred_languages?: string[];
    is_active?: boolean | null;
    is_current_user?: boolean | null;
    is_premium?: boolean | null;
    country?: string | null;
    city?: string | null;
    date_joined?: string | null;
};

export type GoogleLoginResponse = {
    tokens: Tokens;
    user?: AdminUser | null;
};

export type LoginResponse = {
    message?: string;
    tokens: Tokens;
    user?: AdminUser | null;
};

export type BasicMessageResponse = {
    message: string;
};

export type PasswordResetResponse = {
    message: string;
    email: string;
    expires_in: number;
};

export type PaginatedResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

export type AdPlacement = {
    id?: string;
    key?: string | null;
    title?: string | null;
    is_active?: boolean | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export type AdCreative = {
    id?: string;
    title?: string | null;
    image_url?: string | null;
    target_url?: string | null;
    starts_at?: string | null;
    ends_at?: string | null;
    is_active?: boolean | null;
    placement_id?: string | null;
    placement_key?: string | null;
};

export type PlaceCategory = {
    id?: string;
    name?: string | null;
    icon?: string | null;
    is_active?: boolean | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export type PlaceListItem = {
    id?: string;
    name?: string | null;
    category_id?: string | null;
    category_name?: string | null;
    category_icon?: string | null;
    logo_url?: string | null;
    city?: string | null;
    country?: string | null;
    is_active?: boolean | null;
    is_verified?: boolean | null;
    avg_rating?: string | number | null;
    reviews_count?: number | null;
    first_image_url?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export type PlaceImage = {
    id?: string;
    image_url?: string | null;
    caption?: string | null;
    sort_order?: number | null;
};

export type PlaceService = {
    id?: string;
    name?: string | null;
    is_available?: boolean | null;
};

export type PlaceDetail = {
    id?: string;
    name?: string | null;
    description?: string | null;
    category_id?: string | null;
    category_name?: string | null;
    category_icon?: string | null;
    logo_url?: string | null;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    latitude?: string | number | null;
    longitude?: string | number | null;
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    website?: string | null;
    opening_hours?: unknown;
    is_verified?: boolean | null;
    is_active?: boolean | null;
    avg_rating?: string | number | null;
    reviews_count?: number | null;
    images?: PlaceImage[];
    services?: PlaceService[];
    created_at?: string | null;
    updated_at?: string | null;
};

export type ListingSubmissionListItem = {
    id?: string;
    name?: string | null;
    category_id?: string | null;
    category_name?: string | null;
    category_icon?: string | null;
    description?: string | null;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    latitude?: string | number | null;
    longitude?: string | number | null;
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    website?: string | null;
    opening_hours?: unknown;
    status?: string | null;
    reviewer_notes?: string | null;
    submitted_by_id?: string | null;
    submitted_by_name?: string | null;
    submitted_by_email?: string | null;
    submitted_by_phone?: string | null;
    reviewer_id?: string | null;
    reviewer_name?: string | null;
    approved_place_id?: string | null;
    approved_place_name?: string | null;
    images_count?: number | null;
    services_count?: number | null;
    first_image_url?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export type ListingSubmissionImage = {
    id: string;
    image_url: string | null;
    caption?: string | null;
    sort_order?: number | null;
    created_at?: string | null;
};

export type ListingSubmissionService = {
    id: string;
    name?: string | null;
    is_available?: boolean | null;
    sort_order?: number | null;
    created_at?: string | null;
};

export type ListingSubmissionRejection = {
    id: string;
    reason?: string | null;
    rejected_by_id?: string | null;
    rejected_by_name?: string | null;
    created_at?: string | null;
};

export type ListingSubmissionDetail = ListingSubmissionListItem & {
    images?: ListingSubmissionImage[];
    services?: ListingSubmissionService[];
    rejections?: ListingSubmissionRejection[];
};

export type EventSubmissionListItem = {
    id?: string;
    title?: string | null;
    description?: string | null;
    banner_url?: string | null;
    start_at?: string | null;
    end_at?: string | null;
    venue_name?: string | null;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    latitude?: string | number | null;
    longitude?: string | number | null;
    organizer_name?: string | null;
    organizer_contact?: string | null;
    status?: string | null;
    reviewer_notes?: string | null;
    submitted_by_id?: string | null;
    submitted_by_name?: string | null;
    submitted_by_email?: string | null;
    submitted_by_phone?: string | null;
    reviewer_id?: string | null;
    reviewer_name?: string | null;
    approved_event_id?: string | null;
    approved_event_title?: string | null;
    tickets_count?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export type EventSubmissionTicket = {
    id: string;
    category?: string | null;
    price?: string | number | null;
    consumable?: boolean | null;
    consumable_description?: string | null;
    created_at?: string | null;
};

export type EventSubmissionRejection = {
    id: string;
    reason?: string | null;
    rejected_by_id?: string | null;
    rejected_by_name?: string | null;
    created_at?: string | null;
};

export type EventSubmissionDetail = EventSubmissionListItem & {
    tickets?: EventSubmissionTicket[];
    rejections?: EventSubmissionRejection[];
};

export type Review = {
    id: string;
    place_id?: string | null;
    place_name?: string | null;
    user_id?: string | null;
    user_name?: string | null;
    user_avatar_url?: string | null;
    rating: number;
    comment?: string | null;
    is_reported?: boolean;
    published?: boolean;
    report_review_id?: string | null;
    created_at?: string | null;
};

export type ReviewReport = {
    id: string;
    review_id?: string | null;
    place_id?: string | null;
    place_name?: string | null;
    reviewer_id?: string | null;
    reviewer_name?: string | null;
    reason?: string | null;
    details?: string | null;
    status?: string | null;
    comment?: string | null;
    reported_by_id?: string | null;
    created_at?: string | null;
};

export type HighlightLike = {
    id: string;
    highlight_id?: string | null;
    place_id?: string | null;
    place_title?: string | null;
    event_id?: string | null;
    event_title?: string | null;
    user_id?: string | null;
    user_first_name?: string | null;
    user_last_name?: string | null;
    user_email?: string | null;
    created_at?: string | null;
};

export type HighlightComment = {
    id: string;
    highlight_id?: string | null;
    place_id?: string | null;
    place_title?: string | null;
    event_id?: string | null;
    event_title?: string | null;
    user_id?: string | null;
    user_first_name?: string | null;
    user_last_name?: string | null;
    user_email?: string | null;
    text?: string | null;
    created_at?: string | null;
};

export type HighlightShare = {
    id: string;
    highlight_id?: string | null;
    place_id?: string | null;
    place_title?: string | null;
    event_id?: string | null;
    event_title?: string | null;
    user_id?: string | null;
    user_first_name?: string | null;
    user_last_name?: string | null;
    user_email?: string | null;
    channel?: string | null;
    created_at?: string | null;
};
