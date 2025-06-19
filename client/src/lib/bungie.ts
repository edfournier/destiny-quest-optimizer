export interface BungieTokenResponse {
    token_type: string;
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in: number;
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
    const data = await response.json();
    return data;
}

/*
 * Below are unused legacy helper functions from when I was implementing auth myself
 */

/*
async function getTokenInfo(code: string): Promise<any> {
    const response = await fetch("https://www.bungie.net/Platform/App/OAuth/token/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&code=${code}&grant_type=authorization_code`
    });
    const data = await response.json();
    return data;
}

async function getProfiles(token: string, membershipId: string): Promise<Profile[]> {
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

async function getCharacters(token: string, membershipId: string, membershipType: number): Promise<any> {
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
*/
