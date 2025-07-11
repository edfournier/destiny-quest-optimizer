import { AllDestinyManifestComponents, DestinyManifest } from "bungie-api-ts/destiny2";
import Dexie, { Table } from "dexie";

// Subset of manifest components relevant to the app
const keys = [
    "DestinyInventoryItemDefinition",
    "DestinyObjectiveDefinition",
    "DestinyRecordDefinition"
] as const;
export type ComponentKeys = typeof keys[number];
export type ManifestDefinitions = Pick<AllDestinyManifestComponents, ComponentKeys>;

// TODO: this being a class isn't really beneficial, probably change to functions
class ManifestDB extends Dexie {
    private manifest!: Table;

    constructor() {
        super("destiny-quest-optimizer");
        this.version(1).stores({ manifest: "" });
    }

    async build(): Promise<this> {
        // Fetch latest manifest
        const response = await fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/`);
        if (!response.ok) {
            throw new Error("Bad response from GetManifest");
        }
        const data = await response.json();
        const manifest: DestinyManifest = data.Response;

        // Don't check manifest.version since Bungie doesn't always update it
        // TODO: maybe check manifest is in tact, e.g. all keys present
        const version = manifest.jsonWorldContentPaths.en;
        console.log(`Fetched manifest (version: ${version})`);
        if (version === localStorage.getItem("manifest-version")) {
            return this;
        }
        localStorage.setItem("manifest-version", version);

        // Refresh IDB with latest definitions
        await Promise.all(
            keys.map(async (keys) => {
                const path = manifest.jsonWorldComponentContentPaths.en[keys];
                const response = await fetch(`https://www.bungie.net${path}`);
                const definition = await response.json();
                return this.manifest.put(definition, keys);
            })
        );
        return this;
    }

    async getDefinitions(): Promise<ManifestDefinitions> {
        const values = await this.manifest.bulkGet([...keys]);
        const definitions = {} as ManifestDefinitions;
        for (let i = 0; i < values.length; i++) {
            definitions[keys[i]] = values[i];
        }
        return definitions;
    }
}

export const manifestDB = new ManifestDB();
