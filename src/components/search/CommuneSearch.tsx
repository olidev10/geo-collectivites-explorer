"use client";

import { searchCommunes } from "@/lib/geo-api";
import { CommuneCollection } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

type Props = {
  onSelect: (feature: CommuneCollection["features"][0]) => void;
};

const MIN_QUERY_LENGTH = 3;

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
        <div className="glass-panel rounded-[28px] p-5 sm:p-6">
            <div className="space-y-5">
                <div className="space-y-2">
                    <p className="section-label text-xs font-bold">Recherche</p>
                    <h2 className="text-2xl font-semibold text-slate-950">Trouver une commune</h2>
                </div>

                <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Nom de la commune</span>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Exemple : Bordeaux"
                        className="w-full rounded-2xl border border-[var(--border)] bg-white/85 px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)]"
                    />
                </label>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => void handleSearch()}
                        className="ui-button ui-button-primary rounded-2xl px-4 py-3 text-sm font-semibold"
                    >
                        Rechercher
                    </button>
                    <div className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--primary-strong)]">
                        Minimum {MIN_QUERY_LENGTH} caracteres
                    </div>
                </div>

                {loading && <p className="text-sm text-slate-500">Recherche en cours...</p>}

                <div className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)]">
                    <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                        <p className="text-sm font-semibold text-slate-800">Resultats</p>
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                            {results?.length ?? 0} commune{results?.length === 1 ? "" : "s"}
                        </p>
                    </div>

                    <div className="max-h-80 overflow-auto">
                        {results && results.map((item, index) => (
                            <button
                                type="button"
                                key={item.properties.code}
                                onClick={() => onSelect(item)}
                                className="ui-button block w-full border-b border-white/70 px-4 py-4 text-left transition last:border-b-0 hover:bg-white/80"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="font-semibold text-slate-950">{item.properties.nom}</div>
                                        <div className="mt-1 text-sm text-slate-500">
                                            Code INSEE : {item.properties.code}
                                        </div>
                                    </div>
                                    <div className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>
                                </div>
                            </button>
                        ))}

                        {!loading && query.length >= MIN_QUERY_LENGTH && !results && (
                            <div className="px-4 py-5 text-sm text-slate-500">Aucun resultat trouve.</div>
                        )}

                        {!loading && query.length < MIN_QUERY_LENGTH && (
                            <div className="px-4 py-5 text-sm text-slate-500">
                                Entrer un nom de commune pour afficher les communes correspondantes.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

}
