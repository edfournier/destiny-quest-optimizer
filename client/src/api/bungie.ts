import axios from "axios";
import { TokenInfo, Profile } from "./bungie.types";

export async function getTokenInfo(code: string): Promise<TokenInfo> {
    const response = await axios.post(
        "https://www.bungie.net/Platform/App/OAuth/token/",
        `client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&code=${code}&grant_type=authorization_code`,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );
    return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type,
        bungieId: response.data.membership_id
    };
}

export async function getProfiles(token: string, membershipId: string): Promise<Profile[]> {
    const response = await axios.get(`https://www.bungie.net/Platform/Destiny2/254/Profile/${membershipId}/LinkedProfiles/`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY
        }
    });
    return response.data.Response.profiles;
}

export async function getCharacters(token: string, membershipId: string, membershipType: number): Promise<any> {
    const response = await axios.get(`https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=200,202,205`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY
        }
    });
    return response.data.Response;
}
