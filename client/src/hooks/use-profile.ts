import { useQuery } from "@tanstack/react-query";

export async function getProfile(id: string, type: number) {
    const response = await fetch(`/api/bungie/Destiny2/${type}/Profile/${id}/?components=CharacterInventories,Records`);
    if (!response.ok) {
        throw new Error("Failed to fetch profile");
    }
    return response.json();
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
