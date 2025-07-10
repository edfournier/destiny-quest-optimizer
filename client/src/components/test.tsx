"use client";

import { Session } from "@/types/session";
import { useQuery } from "@tanstack/react-query";

export default function Test({ session }: { session: Session }) {
    // TODO:
    // - in client component, hit `https://www.bungie.net/Platform/Destiny2/${session.type}/Profile/${session.sub}/?components=CharacterInventories,Records`
    // - in client component, call useDefinitions
    // - find and display user's bounties, seasonal challenges, etc.

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const response = await fetch(
                `/api/bungie/Destiny2/${session.type}/Profile/${session.sub}/?components=CharacterInventories,Records`
            );
            const data = await response.json();
            console.log(data);
            return data;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: false
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <div>{data.Message}</div>;
}
