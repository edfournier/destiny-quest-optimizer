"use client";

import { User } from "@/lib/session";
import { useQuery } from "@tanstack/react-query";

export default function Test({ user }: { user: User }) {
    // TODO:
    // - call useDefinitions
    // - find and display user's bounties, seasonal challenges, etc.

    const { data, isLoading, error } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const response = await fetch(
                `/api/bungie/Destiny2/${user.default.membershipType}/Profile/${user.default.membershipId}/?components=CharacterInventories,Records`
            );
            return response.json();
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: false
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    console.log(user);
    console.log(data);

    return <div>{data.Message}</div>;
}
