import { DestinyManifest } from "bungie-api-ts/destiny2";

export async function getLatestManifest(): Promise<DestinyManifest> {
    const response = await fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/`);
    if (!response.ok) {
        throw new Error("Bad response from GetManifest");
    }
    const data = await response.json();
    return data.Response;
}
