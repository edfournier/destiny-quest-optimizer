import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
    try {
        // Build redirect
        const state = crypto.randomBytes(16).toString("hex");
        const url = new URL(`https://www.bungie.net/en/OAuth/Authorize`);
        url.searchParams.set("client_id", process.env.NEXT_PUBLIC_BUNGIE_CLIENT_ID!);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("state", state);

        // Set OAuth state and redirect
        const res = NextResponse.redirect(url.toString());
        res.cookies.set("bungie-oauth-state", state, {
            httpOnly: true,
            secure: true,
            maxAge: 180
        });
        
        return res;
    } catch (error) {
        console.error("Auth redirect error:", error);
        return NextResponse.redirect(`${process.env.BASE_NEXT_URL}/login`);
    }
}
