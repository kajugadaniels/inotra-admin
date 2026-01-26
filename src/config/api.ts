const FALLBACK_API_BASE_URL = "http://localhost:8000/api/superadmin";

export function getApiBaseUrl(): string {
    const raw = process.env.NEXT_PUBLIC_API_BASE_URL ?? FALLBACK_API_BASE_URL;
    const trimmed = raw.trim();
    return trimmed.replace(/\/+$/, "");
}
