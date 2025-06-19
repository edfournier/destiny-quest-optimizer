export interface TokenInfo {
    accessToken: string;
    expiresIn: number;
    tokenType: string;
    bungieId: string;
}

export interface Profile {
    membershipId: string;
    membershipType: number;
    bungieGlobalDisplayName: string;
}

export async function getTokenInfo(code: string): Promise<TokenInfo> {
    const response = await fetch("https://www.bungie.net/Platform/App/OAuth/token/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&code=${code}&grant_type=authorization_code`
    });
    const data = await response.json();
    return {
        accessToken: data.access_token,
        expiresIn: data.expires_in,
        tokenType: data.token_type,
        bungieId: data.membership_id
    };
}

export async function getProfiles(token: string, membershipId: string): Promise<Profile[]> {
    const response = await fetch(
        `https://www.bungie.net/Platform/Destiny2/254/Profile/${membershipId}/LinkedProfiles/`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!
            }
        }
    );
    const data = await response.json();
    return data.Response.profiles;
}

export async function getCharacters(token: string, membershipId: string, membershipType: number): Promise<any> {
    const response = await fetch(
        `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=200,202,205`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!
            }
        }
    );
    const data = await response.json();
    return data.Response;
}
