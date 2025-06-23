"use client";

import { useSession } from "@/hooks/use-session";

export default function Dashboard() {
    const { session, loading, error } = useSession();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <p>Welcome {session?.name}!</p>
        </div>
    );
}
