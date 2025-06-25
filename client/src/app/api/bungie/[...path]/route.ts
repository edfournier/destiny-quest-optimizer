import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    return proxy(req, params);
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
    return proxy(req, params);
}

async function proxy(req: NextRequest, params: { path: string[] }) {
    // TODO
    // 1. Extract acess token from cookies
    // 2. Add access token to authorization header
    // 3. Add API key to x-api-key header
    // 4. Extract ...path from params
    // 5. Proxy the request to the Bungie API
}