"use client";
import { getTokenInfo, getProfiles, getCharacters } from "@/api/bungie";
import { useEffect, useState } from "react";

export default function Landing() {
    useEffect(() => {
        async function load() {
            const code = window.location.search.substring(6);
            const tokenInfo = await getTokenInfo(code);
            const profiles = await getProfiles(tokenInfo.accessToken, tokenInfo.bungieId);
            const profile = profiles[0];
            const characters = await getCharacters(tokenInfo.accessToken, profile.membershipId, profile.membershipType);
            console.log(characters);
        }
        load();
    });

    return <div>Welcome!</div>;
}
