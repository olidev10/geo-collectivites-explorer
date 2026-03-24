"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import CommuneSearch from "@/components/search/CommuneSearch";
import { CommuneCollection } from "@/lib/types";
import InfoPanel from "@/components/sidebar/infoPanel";

const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
});

export default function HomePage() {
  const [selectedFeature, setSelectedFeature] = useState<CommuneCollection["features"][0] | null>(null);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Geo Collectivités Explorer</h1>
          <p className="text-slate-600">
            Mini application web SIG pour explorer des données territoriales françaises.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <CommuneSearch onSelect={setSelectedFeature} />
            <InfoPanel feature={selectedFeature} />
          </aside>

          <section>
            <MapView selectedFeature={selectedFeature} />
          </section>
        </div>
      </div>
    </main>
  );
}