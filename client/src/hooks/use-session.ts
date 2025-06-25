import { useEffect, useState } from "react";

type Session = {
    sub: string;
    type: number;
    name: string;
};

export function useSession() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchSession() {
            try {
                const response = await fetch("/api/bungie/auth/session", {
                    credentials: "include"
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch session");
                }
                const data = await response.json();
                setSession({
                    sub: data.session.sub,
                    type: data.session.type,
                    name: data.session.name
                });
            } catch (err: any) {
                setError(err);
                setSession(null);
            } finally {
                setLoading(false);
            }
        }
        
        fetchSession();
    }, []);

    return { session, loading, error };
}
