// In-memory access token store.
// Deliberately NOT in localStorage/sessionStorage; XSS-proof by design.
// Lost on full page reload; AuthContext restores it via silent refresh on app load.

let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
    accessToken = token;
}

export function getAccessToken(): string | null {
    return accessToken;
}
