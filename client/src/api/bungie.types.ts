export interface TokenInfo {
    accessToken: string;
    expiresIn: number;
    tokenType: string;
    bungieId: string;
}

export interface Profile {
    membershipId: string;
    membershipType: number;
    bungieGlobalDisplayName: string;
}

export interface Item {
    itemHash: number;
    quantity: number;
    bindStatus: number;
    location: number;
    bucketHash: number;
    transferStatus: number;
    lockable: boolean;
    state: number;
    isWrapper: boolean;
    tooltipNotificationIndexes: number[];
    itemInstanceId?: string;
    overrideStyleItemHash?: number;
    expirationDate?: string;
    metricHash?: number;
    metricObjective?: Objective;
    versionNumber?: number;
    itemValueVisibility?: boolean[];
}

export interface Objective {
    objectiveHash: number;
    destinationHash?: number;
    activityHash?: number;
    progress?: number;
    completionValue: number;
    complete: boolean;
    visible: boolean;
}
