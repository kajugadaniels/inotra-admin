export type GoogleCredentialResponse = {
    credential?: string;
    select_by?: string;
};

type GoogleAccountsId = {
    initialize: (options: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
    }) => void;
    renderButton: (element: HTMLElement, options?: Record<string, unknown>) => void;
    prompt: (callback?: (notification: unknown) => void) => void;
};

type GoogleIdentity = {
    accounts?: {
        id?: GoogleAccountsId;
    };
};

declare global {
    interface Window {
        google?: GoogleIdentity;
    }
}

let scriptPromise: Promise<void> | null = null;

export function loadGoogleIdentityScript(): Promise<void> {
    if (typeof window === "undefined") {
        return Promise.reject(new Error("Google SDK unavailable on server."));
    }

    if (scriptPromise) return scriptPromise;

    scriptPromise = new Promise((resolve, reject) => {
        if (window.google?.accounts?.id) {
            resolve();
            return;
        }

        const existing = document.querySelector<HTMLScriptElement>(
            'script[src="https://accounts.google.com/gsi/client"]'
        );
        if (existing) {
            existing.addEventListener("load", () => resolve());
            existing.addEventListener("error", () => reject(new Error("Google SDK failed to load.")));
            return;
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Google SDK failed to load."));
        document.head.appendChild(script);
    });

    return scriptPromise;
}

export function getGoogleIdentityClient(): GoogleAccountsId | null {
    return window?.google?.accounts?.id ?? null;
}
