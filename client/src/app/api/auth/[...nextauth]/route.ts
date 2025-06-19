import { useRefreshToken } from "@/lib/bungie";
import NextAuth from "next-auth";
import { Provider } from "next-auth/providers/index";

const bungieProvider: Provider = {
    id: "bungie",
    name: "Bungie",
    type: "oauth",
    checks: ["state"],
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
            const response = await fetch(`https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/`, {
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`,
                    "X-API-KEY": process.env.BUNGIE_API_KEY!
                }
            });
            if (!response.ok) {
                throw new Error("Bad response from GetMembershipsForCurrentUser");
            }
            const data = await response.json();
            return data.Response;
        }
    },
    profile(profile) {
        return {
            id: profile.primaryMembershipId,
            name: profile.bungieNetUser.displayName,
            image: profile.bungieNetUser.profilePicturePath
        };
    }
};

const handler = NextAuth({
    providers: [bungieProvider],
    callbacks: {
        async jwt({ token, account }) {
            // Initial sign-in creates JWT and stores it in cookies
            if (account) {
                return {
                    ...token,
                    bungie: {
                        tokenType: account.token_type,
                        accessToken: account.access_token,
                        accessExpiresAt: account.expires_at,
                        refreshToken: account.refresh_token,
                        refreshExpiresAt: Date.now() + (account.refresh_expires_in as number) * 1000
                    }
                };
            }

            // Refresh access token 5 minutes before expiration
            if (Date.now() > (token.accessExpiresAt as number) - 300_000) {
                const refreshed = await useRefreshToken(token.refreshToken as string);
                return {
                    ...token,
                    bungie: {
                        tokenType: refreshed.token_type,
                        accessToken: refreshed.access_token,
                        accessExpiresAt: Date.now() + refreshed.expires_in * 1000,
                        refreshToken: refreshed.refresh_token,
                        refreshExpiresAt: Date.now() + refreshed.refresh_expires_in * 1000
                    }
                };
            }
            return token;
        },
        async session({ session, token }) {
            // By default, session only exposes name/email/image from token to client
            // Can expose access token, but not ideal
            console.log("Session:", session);
            console.log("Token:", token);
            return session;
        }
    }
});

export { handler as GET, handler as POST };