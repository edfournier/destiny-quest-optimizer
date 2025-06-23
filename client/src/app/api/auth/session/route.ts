import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const jwt = cookieStore.get("dqo-session-token")?.value;
        if (!jwt) {
            return NextResponse.json({ error: "No session token found" }, { status: 401 });
        }

        const decoded = verify(jwt, process.env.JWT_SECRET_KEY!, {
            issuer: "destiny-quest-optimizer",
            algorithms: ["HS256"]
        });

        return NextResponse.json({ session: decoded });
    } catch (error) {
        console.error("Session error:", error);
        return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }
}
