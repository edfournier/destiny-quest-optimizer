"use client";

import { useSession } from "@/hooks/use-session";
import { useDefinitions } from "@/hooks/use-definitions";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
    // TODO: handle errors from here
    const { data: session, isLoading: sessionLoading } = useSession();
    const { data: definitions, isLoading: definitionsLoading } = useDefinitions();

    // TODO: display users current bounties, need to use definitions and filter below
    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const response = await fetch(
                `/api/bungie/Destiny2/${session!.type}/Profile/${session!.sub}/?components=CharacterInventories,Records`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch profile data");
            }
            return response.json();
        },
        enabled: !sessionLoading
    });

    if (definitionsLoading || sessionLoading || profileLoading) {
        return <div>Loading...</div>;
    }

    console.log(session);
    console.log(definitions);
    console.log(profile);

    return (
        <div>
            <p>Welcome {session?.name}!</p>
        </div>
    );
}
