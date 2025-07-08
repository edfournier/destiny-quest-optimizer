import { useEffect, useState } from "react";
import Dexie, { Table } from "dexie";
import { getManifest } from "@/lib/bungie";

export class Database extends Dexie {
    private definitions!: Table;
    private readonly keys: string[] = [
        "DestinyInventoryItemDefinition",
        "DestinyObjectiveDefinition",
        "DestinyRecordDefinition"
    ];

    constructor() {
        super("destiny-quest-optimizer");
        this.version(1).stores({ definitions: "key" });
    }

    async build(): Promise<this> {
        const manifest = await getManifest();

        await Promise.all(
            this.keys.map(async (key) => {
                const path = manifest.jsonWorldComponentContentPaths.en[key];
                const cached = localStorage.getItem(`path-${key}`);
                if (path === cached) {
                    return;
                }

                // Refresh definitions for this key
                localStorage.setItem(`path-${key}`, path);
                const response = await fetch(`https://www.bungie.net${path}`);
                const definitions = await response.json();
                return this.definitions.put({
                    key: key,
                    value: definitions
                });
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

    getKeys(): string[] {
        return this.keys.slice();
    }
}

export function useDefinitions() {
    const [definitions, setDefinitions] = useState<Record<string, any> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function effect() {
            try {
                const db = await new Database().build();
                const definitions = await db.getDefinitions();
                setDefinitions(definitions);
            }
            catch (err: any) {
                setError(err);
                setDefinitions(null);
            }
            finally {
                setLoading(false);
            }
        }

        effect();
    }, []);

    return { definitions, loading, error };
}