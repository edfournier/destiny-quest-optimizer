import { UserMembershipData } from "bungie-api-ts/user";

export type BungieTokens = {
    accessToken: string,
    accessExpiresAt: number,
    refreshToken: string,
    refreshExpiresAt: number
}

async function getBungieTokens(params: Record<string, string>): Promise<BungieTokens> {
    const stamp = Date.now();
    const response = await fetch("https://www.bungie.net/Platform/App/OAuth/token/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: process.env.BUNGIE_CLIENT_ID!,
            client_secret: process.env.BUNGIE_CLIENT_SECRET!,
            ...params,
        }),
    });
    if (!response.ok) {
        throw new Error("Bad response from Bungie OAuth token endpoint");
    }

    const data = await response.json();
    return {
        accessToken: data.access_token,
        accessExpiresAt: stamp + data.expires_in * 1000,
        refreshToken: data.refresh_token,
        refreshExpiresAt: stamp + data.refresh_expires_in * 1000
    };
}

export function useAuthCode(code: string) {
    return getBungieTokens({ grant_type: "authorization_code", code });
}

export function useRefreshToken(token: string) {
    return getBungieTokens({ grant_type: "refresh_token", refresh_token: token });
}
export async function fetchWithAuth(token: string, url: string, options: RequestInit = {}) {
    // TODO: 
    // - signature should accept BungieTokenResponse (or similar)
    // - checks access token isn't expired - 5
    // - checks refresh token isn't expired - 5
    // - attempts to use refresh token
    // - errors otherwise

    const response = await fetch(url, {
        ...options,
        headers: {
            "X-API-KEY": process.env.BUNGIE_API_KEY!,
            Authorization: `Bearer ${token}`,
            ...options.headers
        }
    });
    if (!response.ok) {
        throw new Error(`Bad response from fetchWithAuth on ${url}`);
    }
    return response;
}

export async function getMemberships(token: string): Promise<UserMembershipData> {
    const response = await fetchWithAuth(token, `https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/`);
    const data = await response.json();
    return data.Response;
}
