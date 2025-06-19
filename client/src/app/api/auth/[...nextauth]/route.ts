import NextAuth from "next-auth";
import { Provider } from "next-auth/providers/index";

const bungieProvider: Provider = {
    id: "bungie",
    name: "Bungie",
    type: "oauth",
    clientId: process.env.BUNGIE_CLIENT_ID,
    clientSecret: process.env.BUNGIE_CLIENT_SECRET,
    authorization: {
        url: "https://www.bungie.net/en/OAuth/Authorize",
        params: {
            scope: undefined // Default is scope:openid, which Bungie.net doesn't like
        }
    },
    token: "https://www.bungie.net/Platform/App/OAuth/token/",
    userinfo: {
        async request({ tokens }) {
            // TODO: handle errors
            const response = await fetch(
                `https://www.bungie.net/Platform/Destiny2/254/Profile/${tokens.membership_id}/LinkedProfiles/`,
                {
                    headers: {
                        Authorization: `Bearer ${tokens.access_token}`,
                        "X-API-KEY": process.env.BUNGIE_API_KEY!
                    }
                }
            );
            const data = await response.json();
            return data.Response.profiles[0];
        }
    },
    profile(profile) {
        return {
            id: profile.membershipId,
            name: profile.bungieGlobalDisplayName
        };
    }
};

const handler = NextAuth({
    providers: [bungieProvider],
    callbacks: {
        async jwt({ token, account, profile }) {
            // TODO: account has access_token if we want to give it to frontend
            console.log("JWT callback:", { token, account, profile });
            return token;
        }
    }
});

export { handler as GET, handler as POST };
