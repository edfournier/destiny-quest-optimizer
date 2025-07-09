"use client";

import { useDefinitions } from "@/hooks/use-definitions";
import { useSession } from "@/hooks/use-session";
import { useEffect } from "react";

export default function Dashboard() {
    const { definitions, loading: definitionsLoading } = useDefinitions();
    const { session, loading: sessionLoading } = useSession();

    // TODO: remove this test
    useEffect(() => {
        if (session) {
            fetch(`/api/bungie/Destiny2/${session.type}/Profile/${session.sub}/?components=201`)
                .then((res) => res.json())
                .then((data) => console.log(data))
                .catch((err) => console.error(err));
        }
    }, [sessionLoading]);

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
