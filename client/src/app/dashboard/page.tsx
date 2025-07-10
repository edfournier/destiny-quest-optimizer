import { fetchWithAuth } from "@/lib/bungie-auth";
import { decodeSessionToken } from "@/lib/decode";
import { cookies } from "next/headers";

export default async function Dashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access-token")?.value;
    const session = decodeSessionToken(cookieStore.get("dqo-session-token")?.value || "");
    if (!token || !session) {
        return <div>No session found</div>;
    }

    const profile = await fetchWithAuth(
        token,
        `https://www.bungie.net/Platform/Destiny2/${session.type}/Profile/${session.sub}/?components=CharacterInventories,Records`
    );

    console.log(session);
    console.log(profile);

    return (
        <div>
            <p>Welcome {session.name}!</p>
        </div>
    );
}
