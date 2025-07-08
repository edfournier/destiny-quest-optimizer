export async function getCharacters(token: string, membershipId: string, membershipType: number): Promise<any> {
    // TODO: this needs to be proxied to next.js backend
    const response = await fetch(
        `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=201`,
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