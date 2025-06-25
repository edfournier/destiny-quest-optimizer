"use client";

import { useDefinitions } from "@/hooks/use-definitions";
import { useSession } from "@/hooks/use-session";

export default function Dashboard() {
    // const { session, loading, error } = useSession();
    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error.message}</div>;

    const definitions = useDefinitions();

    if (!definitions) return <div>Loading...</div>;

    console.log(definitions);

    return (
        <div>
            <p>Welcome!</p>
        </div>
    );
}
