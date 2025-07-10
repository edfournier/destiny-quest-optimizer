import { verify } from "jsonwebtoken";
import { GroupUserInfoCard } from "bungie-api-ts/groupv2";

export type Session = {
    sub: string;
    iat: number;
    exp: number;
    iss: string;
    user: User;
};

export type User = {
    id: string;
    name: string;
    image: string;
    memberships: GroupUserInfoCard[];
    primaryMembership?: GroupUserInfoCard;
};

export function decodeSessionToken(token: string): Session | null {
    try {
        const decoded = verify(token, process.env.JWT_SECRET_KEY!, {
            issuer: "destiny-quest-optimizer",
            algorithms: ["HS256"]
        });

        // Cast is ok since *only* session tokens are minted with this key
        return decoded as Session;
    } catch (error) {
        console.error("Error getting session:", error);
        return null;
    }
}
