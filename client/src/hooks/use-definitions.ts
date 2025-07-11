import ms from "ms";
import { useQuery } from "@tanstack/react-query";
import { dexie, Definitions, keys } from "@/lib/dexie";

export async function getDefinitions() {
    const records = await dexie.definitions.bulkGet([...keys]);
    const definitions = {} as Definitions;
    for (const record of records) {
        if (!record) {
            throw new Error("Failed to get definitions");
        }
        definitions[record.key] = record.value as any;
    }
    return definitions;
}

export function useDefinitions() {
    return useQuery<Definitions, Error>({
        queryKey: ["definitions"],
        queryFn: getDefinitions,
        staleTime: ms("24h")
    });
}
