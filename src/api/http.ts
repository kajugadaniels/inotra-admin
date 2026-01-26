export type ApiResponse<T> = {
    ok: boolean;
    status: number;
    body: T | null;
    headers: Headers;
};

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
