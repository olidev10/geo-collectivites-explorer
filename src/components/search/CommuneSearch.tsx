"use client";

import { searchCommunes } from "@/lib/geo-api";
import { CommuneCollection } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

type Props = {
  onSelect: (feature: CommuneCollection["features"][0]) => void;
};

export default function CommuneSearch({ onSelect }: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<CommuneCollection["features"] | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = useCallback(async () => {
        if (query.length < 2) {
            setResults(null);
            return;
        }

        setLoading(true);
        try {
            const data = await searchCommunes(query);
            setResults(data.features ?? null);
        } catch (error) {
            console.log("Error searching communes:", error);
            setResults(null);
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        const timer = setTimeout(handleSearch, 350);
        return () => clearTimeout(timer);
    }, [query,handleSearch]);

    return (
        <div className="space-y-3">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une commune..."
                className="w-full rounded-xl border px-4 py-3 outline-none"
            />
            
            {loading && <p className="text-sm text-slate-500">Recherche…</p>}

            <div className="max-h-64 overflow-auto rounded-xl border">
                {results && results.map((item) => (
                    <button
                        key={item.properties.code}
                        onClick={() => onSelect(item)}
                        className="block w-full border-b px-4 py-3 text-left hover:bg-slate-50"
                    >
                        <div className="font-medium">{item.properties.nom}</div>
                        <div className="text-sm text-slate-500">
                            Code INSEE : {item.properties.code}
                        </div>
                    </button>
                ))}

                {!loading && query.length >= 2 && !results && (
                    <div className="px-4 py-3 text-sm text-slate-500">Aucun résultat</div>
                )}
            </div>
        </div>
    )

}