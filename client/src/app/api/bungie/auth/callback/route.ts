import { useAuthCode, getUser } from "@/lib/bungie";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";
import { makeRedirect } from "@/lib/redirect";

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
        const { accessToken, expiresIn, refreshToken, refreshExpiresIn } = await useAuthCode(code!);
        const user = await getUser(accessToken);
        const primaryMembership = user.destinyMemberships.filter(
            (membership) => membership.membershipId === user.primaryMembershipId
        )[0];

        // Sign session token
        // TODO: needs to be asymmetric
        const jwt = sign(
            { name: user.bungieNetUser.displayName, type: primaryMembership.membershipType },
            process.env.JWT_SECRET_KEY!,
            {
                subject: primaryMembership.membershipId,
                expiresIn: "1h",
                algorithm: "HS256",
                issuer: "destiny-quest-optimizer"
            }
        );

        // Set cookies
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "strict" as const
        };
        cookieStore.set("access-token", accessToken, cookieOptions);
        cookieStore.set("access-expires-at", (Date.now() + expiresIn * 1000).toString(), cookieOptions);
        cookieStore.set("refresh-token", refreshToken, cookieOptions);
        cookieStore.set("refresh-expires-at", (Date.now() + refreshExpiresIn * 1000).toString(), cookieOptions);
        cookieStore.set("dqo-session-token", jwt, cookieOptions);

        return makeRedirect("/dashboard");
    } catch (error) {
        console.error("Auth callback error:", error);
        return makeRedirect("/login");
    }
}
