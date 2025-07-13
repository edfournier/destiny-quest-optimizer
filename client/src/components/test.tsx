"use client";

import { useDefinitions } from "@/hooks/use-definitions";
import { useProfile } from "@/hooks/use-profile";
import { User } from "@/lib/session";

export default function Test({ user }: { user: User }) {
    // TODO: find and display user's bounties, seasonal challenges, etc by cross-referencing profile and definitions

    const profile = useProfile(user.default.membershipId, user.default.membershipType);
    const definitions = useDefinitions();

    if (profile.isLoading || definitions.isLoading) {
        return <div>Loading...</div>;
    }
    if (!profile.data || !definitions.data || profile.error || definitions.error) {
        return <div>Error: {profile.error?.message || definitions.error?.message}</div>;
    }

    console.log(profile.data);
    console.log(definitions.data);
    
    return <div>{profile.data.characterInventories.privacy}</div>;
}
