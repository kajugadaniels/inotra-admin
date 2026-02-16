export function extractErrorDetail(body: unknown): string {
    if (!body) return "Unknown error";
    if (typeof body === "string") return body;

    if (typeof body === "object") {
        const data = body as Record<string, unknown>;
        if (data.errors && typeof data.errors === "object") {
            const errors = formatErrorMap(data.errors as Record<string, unknown>);
            if (errors) return errors;
        }
        if (typeof data.message === "string") return data.message;
        if (typeof data.detail === "string") return data.detail;

        // DRF sometimes returns field errors directly:
        //  { "email": ["This field is required."] }
        const fieldErrors = formatErrorMap(data, new Set(["message", "detail", "errors", "code"]));
        if (fieldErrors) return fieldErrors;
    }

    return "Unknown error";
}

function formatErrorMap(
    raw: Record<string, unknown>,
    excludeKeys: Set<string> = new Set(),
): string {
    const entries = Object.entries(raw).filter(([key]) => !excludeKeys.has(key));
    if (!entries.length) return "";

    const formatted = entries
        .map(([key, value]) => {
            const valueText = stringifyErrorValue(value);
            if (!valueText) return "";
            return `${key}: ${valueText}`;
        })
        .filter(Boolean)
        .join(" | ");

    return formatted;
}

function stringifyErrorValue(value: unknown): string {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;

    if (Array.isArray(value)) {
        return value.map(stringifyErrorValue).filter(Boolean).join(", ");
    }

    if (typeof value === "object") {
        try {
            return JSON.stringify(value);
        } catch {
            return String(value);
        }
    }

    return String(value);
}
