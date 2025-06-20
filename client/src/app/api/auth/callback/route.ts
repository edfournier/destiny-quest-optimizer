import { useAuthCode, getUser } from "@/lib/bungie";
import { NextRequest, NextResponse } from "next/server";
import { sign } from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
        // Validate OAuth state
        const stateCookie = req.cookies.get("bungie-oauth-state");
        const stateParam = req.nextUrl.searchParams.get("state");
        if (!stateCookie || !stateParam || stateCookie.value !== stateParam) {
            console.error("OAuth state mismatch");
            const res =  NextResponse.redirect(`${process.env.BASE_NEXT_URL}/login`)
            res.cookies.delete("bungie-oauth-state");
            return res;
        }

        // Fetch user info
        const code = req.nextUrl.searchParams.get("code");
        const tokenInfo = await useAuthCode(code!);
        const user = await getUser(tokenInfo.access_token);
        const primaryMembership = user.destinyMemberships.filter(
            (membership) => membership.membershipId === user.primaryMembershipId
        )[0];

        // Sign JWT with user info
        const jwt = sign({ type: primaryMembership.membershipType }, process.env.JWT_SECRET!, {
            subject: primaryMembership.membershipId,
            expiresIn: "1h",
            algorithm: "HS256",
            issuer: "destiny-quest-optimizer"
        });

        // Set cookies 
        const res = NextResponse.redirect(`${process.env.BASE_NEXT_URL}/dashboard`);
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "strict" as const
        };
        res.cookies.delete("bungie-oauth-state");
        res.cookies.set("access-token", tokenInfo.access_token, options);
        res.cookies.set("access-expires-at", (Date.now() + tokenInfo.expires_in * 1000).toString(), options);
        res.cookies.set("refresh-token", tokenInfo.refresh_token, options);
        res.cookies.set("refresh-expires-at", (Date.now() + tokenInfo.refresh_expires_in * 1000).toString(), options);
        res.cookies.set("dqo-session-token", jwt, options);
        
        return res;
    } catch (error) {
        console.error("Auth callback error:", error);
        return NextResponse.redirect(`${process.env.BASE_NEXT_URL}/login`);
    }
}
