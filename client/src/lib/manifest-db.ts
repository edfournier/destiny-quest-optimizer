import { DestinyManifest } from "bungie-api-ts/destiny2";
import Dexie, { Table } from "dexie";

class ManifestDB extends Dexie {
    private definitions!: Table;
    private keys: string[] = [
        "DestinyInventoryItemDefinition",
        "DestinyObjectiveDefinition",
        "DestinyRecordDefinition"
    ];

    constructor() {
        super("destiny-quest-optimizer");
        this.version(1).stores({ definitions: "key" });
    }

    async getLatestManifest(): Promise<DestinyManifest> {
        const response = await fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/`);
        if (!response.ok) {
            throw new Error("Bad response from GetManifest");
        }
        const data = await response.json();
        return data.Response;
    }

    async build(): Promise<this> {
        const manifest = await this.getLatestManifest();
        console.log(`Fetched manifest (version: ${manifest.version})`);
        if (manifest.version === localStorage.getItem("manifest-version")) {
            return this;
        }
        localStorage.setItem("manifest-version", manifest.version);

        // Refresh cached definitions for desired keys
        await Promise.all(
            this.keys.map(async (key) => {
                const path = manifest.jsonWorldComponentContentPaths.en[key];
                localStorage.setItem(`path-${key}`, path);
                const response = await fetch(`https://www.bungie.net${path}`);
                const definitions = await response.json();
                return this.definitions.put({ key, value: definitions });
            })
        );
        return this;
    }

    async getDefinitions(): Promise<Record<string, any>> {
        const definitions = await Promise.all(this.keys.map((key) => this.definitions.get(key)));
        return definitions.reduce((acc, e) => {
            acc[e.key] = e.value;
            return acc;
        }, {});
    }
}

export const manifestDB = new ManifestDB();
