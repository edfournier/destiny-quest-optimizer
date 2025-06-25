import { NextResponse } from "next/server";

/**
 * @param url - An aboslute or relative URL.
 * @returns A redirect response for the given URL.
 */
export function makeRedirect(url: string) {
    // Absolute paths
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return NextResponse.redirect(url);
    }

    // Prepend '/' for local if needed
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return NextResponse.redirect(`${process.env.NEXT_BASE_URL}${cleanUrl}`);
}
