import { useQuery } from "@tanstack/react-query";
import { DestinyProfileResponse } from "bungie-api-ts/destiny2";

export type ProfileComponents = Pick<
    DestinyProfileResponse,
    "characterInventories" | "characterRecords" | "profileRecords"
>;

export async function getProfile(id: string, type: number): Promise<ProfileComponents> {
    const response = await fetch(`/api/bungie/Destiny2/${type}/Profile/${id}/?components=CharacterInventories,Records`);
    if (!response.ok) {
        throw new Error("Failed to fetch profile");
    }
    const data = await response.json();
    return data.Response;
}

export function useProfile(id: string, type: number) {
    // TODO: configure refetch interval
    return useQuery({
        queryKey: ["profile", id, type],
        queryFn: () => getProfile(id, type),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: false
    });
}
