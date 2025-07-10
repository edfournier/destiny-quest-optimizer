import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    return proxy(req);
}

export async function POST(req: NextRequest) {
    return proxy(req);
}

async function proxy(req: NextRequest) {
    const token = req.cookies.get("access-token")?.value;
    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const base = "https://www.bungie.net/Platform";
        const path = req.nextUrl.pathname.slice(11) + req.nextUrl.search; // Slices off '/api/bungie'
        const url = `${base}${path}`;

        const headers = new Headers();
        headers.set("Authorization", `Bearer ${token}`);
        headers.set("X-API-KEY", process.env.BUNGIE_API_KEY!);
        headers.set("Content-Type", req.headers.get("content-type") || "application/json");

        const response = await fetch(url, {
            method: req.method,
            headers,
            body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text()
        });
        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to proxy request" }, { status: 500 });
    }
}
