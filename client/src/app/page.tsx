"use client";

export default function Home() {
    function redirect() {
        window.location.href = `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&response_type=code`;
    }

    return (
        <div>
            <button onClick={redirect}>Login with Bungie</button>
        </div>
    );
}
