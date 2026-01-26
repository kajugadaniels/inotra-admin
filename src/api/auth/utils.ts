export function extractErrorDetail(body: unknown): string {
    if (!body) return "Unknown error";
    if (typeof body === "string") return body;

    if (typeof body === "object") {
        const data = body as Record<string, unknown>;
        if (typeof data.message === "string") return data.message;
        if (typeof data.detail === "string") return data.detail;
        if (data.errors && typeof data.errors === "object") {
            const errors = Object.entries(data.errors)
                .map(([key, value]) => {
                    if (Array.isArray(value)) {
                        return `${key}: ${value.join(", ")}`;
                    }
                    return `${key}: ${String(value)}`;
                })
                .join(" | ");
            if (errors) return errors;
        }
    }

    return "Unknown error";
}
