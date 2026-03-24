"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import CommuneSearch from "@/components/search/CommuneSearch";
import { CommuneCollection } from "@/lib/types";
import InfoPanel from "@/components/sidebar/infoPanel";

const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => <p>Chargement de la carte...</p>,
});

export default function HomePage() {
  const [selectedFeature, setSelectedFeature] = useState<CommuneCollection["features"][0] | null>(null);

  return (
    <main className="app-shell min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-7xl space-y-6">

        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="space-y-5">
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
