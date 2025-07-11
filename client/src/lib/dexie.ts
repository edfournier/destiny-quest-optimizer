import { AllDestinyManifestComponents, DestinyManifest } from "bungie-api-ts/destiny2";
import Dexie, { Table } from "dexie";

// TODO: fix the naming scheme for these types
// Subset of manifest definitions relevant to the app
export const keys = [
    "DestinyInventoryItemDefinition",
    "DestinyObjectiveDefinition",
    "DestinyRecordDefinition"
] as const;

export type Keys = typeof keys[number];

export type Definitions = Pick<AllDestinyManifestComponents, Keys>;

export type DefinitionRecord = {
    key: Keys;
    value: Definitions[Keys];
};

export const dexie = new Dexie('database') as Dexie & {
    definitions: Table<
        DefinitionRecord, 
        string
    >; 
};

dexie.version(1).stores({ definitions: "key" });

// Queries wait until the promise from this callback has resolved
dexie.on("ready", async (vipDB: Dexie) => {
    // Fetch latest manifest
    const response = await fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/`);
    if (!response.ok) {
        throw new Error("Bad response from GetManifest");
    }
    const data = await response.json();
    const manifest: DestinyManifest = data.Response;
    const version = manifest.jsonWorldContentPaths.en;
    if (version === localStorage.getItem("manifest-version")) {
        return;
    }

    // Refresh IDB with latest definitions
    await Promise.all(
        keys.map(async (key) => {
            const path = manifest.jsonWorldComponentContentPaths.en[key];
            const response = await fetch(`https://www.bungie.net${path}`);
            const definition = await response.json();
            await (vipDB as typeof dexie).definitions.put({ key, value: definition });
        })
    );
    localStorage.setItem("manifest-version", version);
});