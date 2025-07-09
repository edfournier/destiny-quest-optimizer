export interface BungieTokenResponse {
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    refreshExpiresIn: number;
}

export interface BungieUserResponse {
    primaryMembershipId: string;
    profilePicturePath: string;
    bungieNetUser: {
        uniqueName: string;
        displayName: string;
    };
    destinyMemberships: {
        membershipId: string;
        membershipType: number;
    }[];
}

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

    const data = await response.json();
    return {
        tokenType: data.token_type,
        accessToken: data.access_token,
        expiresIn: data.expires_in,
        refreshToken: data.refresh_token,
        refreshExpiresIn: data.refresh_expires_in
    };
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

    const data = await response.json();
    return {
        tokenType: data.token_type,
        accessToken: data.access_token,
        expiresIn: data.expires_in,
        refreshToken: data.refresh_token,
        refreshExpiresIn: data.refresh_expires_in
    };
}

export async function getUser(token: string): Promise<BungieUserResponse> {
    const response = await fetch(`https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": process.env.BUNGIE_API_KEY!
        }
    });
    if (!response.ok) {
        throw new Error("Bad response from GetMembershipsForCurrentUser");
    }

    const data = await response.json();
    return data.Response;
}

export async function getManifest(): Promise<any> {
    const response = await fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/`);
    if (!response.ok) {
        throw new Error("Bad response from GetManifest");
    }
    const data = await response.json();
    return data.Response;
}
