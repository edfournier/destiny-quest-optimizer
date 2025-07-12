import { NextRequest, NextResponse } from "next/server";
import { fetchWithAuth } from "@/lib/bungie-auth";

// TODO: support POST requests

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("access-token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const base = "https://www.bungie.net/Platform";
        const prefix = "/api/bungie";
        const path = req.nextUrl.pathname.slice(prefix.length);
        const url = base + path + req.nextUrl.search;
        const response = await fetchWithAuth(token, url);
        const data = await response.json();

        return NextResponse.json(data);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to proxy request" }, { status: 500 });
    }
}
