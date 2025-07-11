import ms from "ms";
import { useQuery } from "@tanstack/react-query";
import { manifestDB, ManifestDefinitions } from "@/lib/manifest-db";

export function useDefinitions() {
    return useQuery<ManifestDefinitions, Error>({
        queryKey: ["definitions"],
        queryFn: async () => {
            const db = await manifestDB.build();
            return db.getDefinitions();
        },
        staleTime: ms("24h")
    });
}
