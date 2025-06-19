"use client";

import { useSession } from "next-auth/react";

export default function Dashboard() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    console.log("session:", session, status);

    return (
        <div>
            <p>Welcome {session?.user?.name}!</p>
        </div>
    );
}
