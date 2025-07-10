import { decodeSessionToken } from "@/lib/decode";
import { cookies } from "next/headers";

export default async function Dashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get("dqo-session-token")?.value;
    const session = token ? decodeSessionToken(token) : null;
    if (!session) {
        return <div>No session!</div>;
    }

    console.log(session);

    // TODO:
    // - in client component, hit `https://www.bungie.net/Platform/Destiny2/${session.type}/Profile/${session.sub}/?components=CharacterInventories,Records`
    // - in client component, call useDefinitions
    // - find and display user's bounties, seasonal challenges, etc. 

    return (
        <div>
            <p>Welcome {session.name}!</p>
        </div>
    );
}
