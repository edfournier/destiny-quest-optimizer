import Test from "@/components/Test";
import { decodeSessionToken } from "@/lib/session";
import { cookies } from "next/headers";

export default async function Dashboard() {
    const cookieStore = await cookies();
    console.log("All cookies:", cookieStore.getAll());
    const token = cookieStore.get("dqo-session-token")?.value;
    const session = token ? decodeSessionToken(token) : null;
    if (!session) {
        console.log(token);
        return <div>No session!</div>;
    }

    // TODO:
    // - instead of prop drilling, use a context provider (or redux/zustland/etc.) to manage session and user
    // - provider manages which user membership is active
    // - maybe better if provider manages default, backend just provides primaryMembershipId
    return (
        <div>
            <p>Welcome {session.user.name}!</p>
            <Test user={session.user} />
        </div>
    );
}
