"use client";

import { useDefinitions } from "@/hooks/use-definitions";
import { useSession } from "@/hooks/use-session";
import { useEffect } from "react";

export default function Dashboard() {
    const { definitions, loading: definitionsLoading } = useDefinitions();
    const { session, loading: sessionLoading } = useSession();

    if (definitionsLoading || sessionLoading) {
        return <div>Loading...</div>;
    }

    console.log(session);
    console.log(definitions);

    return (
        <div>
            <p>Welcome {session?.name}!</p>
        </div>
    );
}
