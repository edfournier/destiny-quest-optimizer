import { NextRequest, NextResponse } from "next/server";

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

        const response = await fetch(url, {
            method: req.method,
            headers: {
                Authorization: `Bearer ${token}`,
                "X-API-KEY": process.env.BUNGIE_API_KEY!
            }
        });
        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to proxy request" }, { status: 500 });
    }
}
