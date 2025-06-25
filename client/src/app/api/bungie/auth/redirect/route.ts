import { cookies } from "next/headers";
import crypto from "crypto";
import { makeRedirect } from "@/lib/redirect";

export async function GET() {
    try {
        // Build redirect URL
        const state = crypto.randomBytes(16).toString("hex");
        const url = new URL(`https://www.bungie.net/en/OAuth/Authorize`);
        url.searchParams.set("client_id", process.env.BUNGIE_CLIENT_ID!);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("state", state);

        // Set OAuth state cookie
        const cookieStore = await cookies();
        cookieStore.set("bungie-oauth-state", state, {
            httpOnly: true,
            secure: true,
            maxAge: 180,
            path: "/api/bungie/auth/callback"
        });

        return makeRedirect(url.toString());
    } catch (error) {
        console.error("Auth redirect error:", error);
        return makeRedirect("/login");
    }
}
