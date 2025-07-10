import { UserMembershipData } from "bungie-api-ts/user";

export type BungieTokenResponse = {
    token_type: string;
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in: number;
    membership_id: string; // Bungie.net membership ID
};

export async function useRefreshToken(token: string): Promise<BungieTokenResponse> {
    const response = await fetch(`https://www.bungie.net/Platform/App/OAuth/token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            client_id: process.env.BUNGIE_CLIENT_ID!,
            client_secret: process.env.BUNGIE_CLIENT_SECRET!,
            refresh_token: token,
            grant_type: "refresh_token"
        })
    });
    if (!response.ok) {
        throw new Error("Bad response from refresh token endpoint");
    }
    return response.json();
}

export async function useAuthCode(code: string): Promise<BungieTokenResponse> {
    const response = await fetch("https://www.bungie.net/Platform/App/OAuth/token/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            client_id: process.env.BUNGIE_CLIENT_ID!,
            client_secret: process.env.BUNGIE_CLIENT_SECRET!,
            code,
            grant_type: "authorization_code"
        })
    });
    if (!response.ok) {
        throw new Error("Bad response from token endpoint");
    }
    return response.json();
}

export async function fetchWithAuth(token: string, url: string, options: RequestInit = {}) {
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
    return response.json();
}

export async function getMemberships(token: string): Promise<UserMembershipData> {
    const data = await fetchWithAuth(token, `https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/`);
    return data.Response;
}
