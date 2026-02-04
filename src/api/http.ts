export type ApiResponse<T> = {
    ok: boolean;
    status: number;
    body: T | null;
    headers: Headers;
};

const ADMIN_TOKENS_KEY = "inotra.admin.tokens";
const ADMIN_SESSION_EXPIRED_KEY = "inotra.admin.session.expired";
let didForceLogout = false;

function forceAdminLogout(): void {
    if (typeof window === "undefined") return;
    if (didForceLogout) return;
    didForceLogout = true;

    try {
        // Used by the login page to show a "Session expired" toast.
        window.sessionStorage.setItem(ADMIN_SESSION_EXPIRED_KEY, "1");
    } catch {
        // ignore
    }

    try {
        window.localStorage.clear();
    } catch {
        // ignore
    }

    // Hard navigation ensures all client state is reset.
    window.location.assign("/");
}

type RequestArgs = {
    apiBaseUrl: string;
    path: string;
    method?: string;
    body?: unknown;
    accessToken?: string;
    headers?: Record<string, string>;
};

export async function requestJson<T>({
    apiBaseUrl,
    path,
    method = "GET",
    body,
    accessToken,
    headers = {},
}: RequestArgs): Promise<ApiResponse<T>> {
    const url = `${apiBaseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    const requestHeaders: Record<string, string> = {
        Accept: "application/json",
        ...headers,
    };

    let payload: BodyInit | undefined;

    if (typeof FormData !== "undefined" && body instanceof FormData) {
        payload = body;
    } else if (body !== undefined && body !== null) {
        requestHeaders["Content-Type"] = "application/json";
        payload = JSON.stringify(body);
    }

    if (accessToken) {
        requestHeaders.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: payload,
    });

    // If the stored access token becomes invalid, force logout and reset local storage.
    // Only do this when an admin session is present to avoid breaking login/forgot flows.
    if (
        typeof window !== "undefined" &&
        response.status === 401 &&
        window.localStorage.getItem(ADMIN_TOKENS_KEY)
    ) {
        forceAdminLogout();
    }

    const rawText = await response.text();
    let parsed: unknown = null;

    if (rawText) {
        try {
            parsed = JSON.parse(rawText);
        } catch {
            parsed = rawText;
        }
    }

    return {
        ok: response.ok,
        status: response.status,
        body: (parsed as T) ?? null,
        headers: response.headers,
    };
}
