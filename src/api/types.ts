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
