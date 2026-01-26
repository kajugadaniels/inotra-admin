import type { AdminUser, Tokens } from "../types";

const TOKEN_KEY = "inotra.admin.tokens";
const USER_KEY = "inotra.admin.user";

export type StoredSession = {
    tokens: Tokens;
    user: AdminUser | null;
};

function readJson<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

function writeJson<T>(key: string, value: T | null): void {
    if (typeof window === "undefined") return;
    if (value === null) {
        window.localStorage.removeItem(key);
        return;
    }
    window.localStorage.setItem(key, JSON.stringify(value));
}

export const authStorage = {
    getTokens(): Tokens | null {
        return readJson<Tokens>(TOKEN_KEY);
    },
    getUser(): AdminUser | null {
        return readJson<AdminUser>(USER_KEY);
    },
    setSession(tokens: Tokens, user: AdminUser | null): void {
        writeJson(TOKEN_KEY, tokens);
        writeJson(USER_KEY, user);
    },
    clear(): void {
        writeJson(TOKEN_KEY, null);
        writeJson(USER_KEY, null);
    },
    clearSession(): void {
        authStorage.clear();
    },
    hydrate(): StoredSession | null {
        const tokens = authStorage.getTokens();
        if (!tokens) return null;
        return { tokens, user: authStorage.getUser() };
    },
};
