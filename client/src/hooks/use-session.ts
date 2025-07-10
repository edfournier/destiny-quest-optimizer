import { useQuery } from "@tanstack/react-query";
import { Session } from "@/types/session";
import ms from "ms";

export async function getSession(): Promise<Session> {
    const response = await fetch("/api/auth/session", { credentials: "include" });
    if (!response.ok) {
        throw new Error("Failed to fetch session");
    }

    const data = await response.json();
    return data.session;
}

export function useSession() {
    return useQuery<Session, Error>({
        queryKey: ["session"],
        queryFn: getSession,
        staleTime: ms("1h")
    });
}
