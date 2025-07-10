import Test from "@/components/Test";
import { decodeSessionToken } from "@/lib/session";
import { cookies } from "next/headers";

export default async function Dashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get("dqo-session-token")?.value;
    const session = token ? decodeSessionToken(token) : null;
    if (!session) {
        return <div>No session!</div>;
    }

    // TODO: instead of prop drilling, use a context provider (or redux/zustland/etc.) and a useSession hook
    return (
        <div>
            <p>Welcome {session.user.name}!</p>
            <Test session={session} />
        </div>
    );
}
