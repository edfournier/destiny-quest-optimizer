import { AllDestinyManifestComponents} from "bungie-api-ts/destiny2";
import Dexie, { Table } from "dexie";
import { getLatestManifest } from "./bungie-requests";

// Manifest definitions relevant to the app
export const keys = [
    "DestinyInventoryItemDefinition",
    "DestinyObjectiveDefinition",
    "DestinyRecordDefinition"
] as const;

export type DefinitionKey = typeof keys[number];

export type Definitions = { 
    [K in DefinitionKey]: AllDestinyManifestComponents[K];
};

export type DefinitionRecord<K extends DefinitionKey = DefinitionKey> = {
    key: K;
    value: Definitions[K];
};

export const dexie = new Dexie("database") as Dexie & {
    definitions: Table<DefinitionRecord, string>;
};

dexie.version(1).stores({ definitions: "key" });

dexie.on("ready", async (vipDB: Dexie) => {
    const vipDexie = vipDB as typeof dexie;

    // Check manifest is update to date and IDB isn't corrupted
    const [manifest, ...checks] = await Promise.all([
        getLatestManifest(),
        ...keys.map(async (key) => {
            const record = await vipDexie.definitions.get(key);
            return record !== undefined;
        })
    ]);
    const latestVersion = manifest.jsonWorldContentPaths.en;
    const cachedVersion = localStorage.getItem("manifest-version");
    if (latestVersion === cachedVersion && checks.every(Boolean)) {
        return;
    }

    // Refresh IDB with latest definitions
    await Promise.all(
        keys.map(async (key) => {
            const path = manifest.jsonWorldComponentContentPaths.en[key];
            const response = await fetch(`https://www.bungie.net${path}`);
            const definition = await response.json();
            await vipDexie.definitions.put({ key, value: definition });
        })
    );
    localStorage.setItem("manifest-version", latestVersion);
});
