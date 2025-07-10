import { verify } from "jsonwebtoken";
import { Session } from "@/types/session";

export function decodeSessionToken(token: string): Session | null {
    try {
        const decoded = verify(token, process.env.JWT_SECRET_KEY!, {
            issuer: "destiny-quest-optimizer",
            algorithms: ["HS256"]
        });
        return decoded as Session;
    } catch (error) {
        console.error("Error getting session:", error);
        return null;
    }
}
