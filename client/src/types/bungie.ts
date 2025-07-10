export type BungieTokenResponse = {
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    refreshExpiresIn: number;
};

export type BungieUserResponse = {
    primaryMembershipId: string;
    profilePicturePath: string;
    bungieNetUser: {
        uniqueName: string;
        displayName: string;
    };
    destinyMemberships: {
        membershipId: string;
        membershipType: number;
    }[];
};
