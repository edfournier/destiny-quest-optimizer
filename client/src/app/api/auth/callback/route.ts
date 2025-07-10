import { useAuthCode, getMemberships } from "@/lib/bungie-auth";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";
import { makeRedirect } from "@/lib/redirect";
import { User } from "@/lib/session";

export async function GET(req: NextRequest) {
    try {
        // Validate OAuth state
        const cookieStore = await cookies();
        const stateCookie = cookieStore.get("bungie-oauth-state");
        const stateParam = req.nextUrl.searchParams.get("state");
        cookieStore.delete("bungie-oauth-state");
        if (!stateCookie || !stateParam || stateCookie.value !== stateParam) {
            throw new Error("OAuth state mismatch");
        }

        // Fetch user info
        const code = req.nextUrl.searchParams.get("code");
        if (!code) {
            throw new Error("Missing authorization code");
        }
        const tokens = await useAuthCode(code);
        const { destinyMemberships, primaryMembershipId, bungieNetUser } = await getMemberships(tokens.access_token);
        const user: User = {
            id: bungieNetUser.membershipId,
            name: bungieNetUser.displayName,
            image: bungieNetUser.profilePicturePath,
            memberships: destinyMemberships,
            default:
                destinyMemberships.find((membership) => membership.membershipId === primaryMembershipId) ||
                destinyMemberships[0]
        };

        // Create session token
        // TODO: should be asymmetric so the Spring Boot server can use them
        const jwt = sign({ user }, process.env.JWT_SECRET_KEY!, {
            subject: bungieNetUser.membershipId,
            expiresIn: "1h",
            algorithm: "HS256",
            issuer: "destiny-quest-optimizer"
        });

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "strict" as const
        };

        const cookieMap = {
            "access-token": tokens.access_token,
            "refresh-token": tokens.refresh_token,
            "access-expires-at": (Date.now() + tokens.expires_in * 1000).toString(),
            "refresh-expires-at": (Date.now() + tokens.refresh_expires_in * 1000).toString(),
            "dqo-session-token": jwt
        };

        // Set cookies specified above
        for (const [key, value] of Object.entries(cookieMap)) {
            cookieStore.set(key, value, cookieOptions);
        }

        return makeRedirect("/dashboard");
    } catch (error) {
        console.error("Auth callback error:", error);
        return makeRedirect("/login");
    }
}
