"use client";

import {
  MapContainer,
  TileLayer,
  Popup,
  useMap,
  Marker,
} from "react-leaflet";
import { useEffect } from "react";
import { CommuneCollection } from "@/lib/types";
import { Icon, LatLngTuple } from "leaflet";

type CommuneFeature = CommuneCollection["features"][0];

const defaultMarkerIcon = new Icon({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString(),
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString(),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

function toLatLng(feature: CommuneFeature): LatLngTuple {
  const [lng, lat] = feature.geometry.coordinates;

  return [lat, lng];
}

function FitToFeature({ feature }: { feature: CommuneFeature | null }) {
  const map = useMap();

  useEffect(() => {
    if (!feature) return;

    map.setView(toLatLng(feature), 12);
  }, [feature, map]);

  return null;
}

export default function MapView({ selectedFeature }: { selectedFeature: CommuneFeature | null }) {
  return (
    <div className="glass-panel overflow-hidden rounded-[32px] p-3 sm:p-4">
      <div className="mb-4 flex flex-col gap-4 rounded-[24px] border border-white/70 bg-white/75 px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-label text-xs font-bold">Cartographie</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Vue geospatiale interactive</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Naviguez dans la carte, zoomez sur une commune selectionnée et visualisez ses
            informations cles dans un environnement de consultation fluide.
          </p>
        </div>
        <div className="rounded-2xl bg-[var(--primary-soft)] px-4 py-3 text-sm font-medium text-[var(--primary-strong)]">
          {selectedFeature ? `Commune active : ${selectedFeature.properties.nom}` : "Aucune commune selectionnée"}
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[var(--border)]">
        <MapContainer
          center={[46.6, 2.4]}
          zoom={6}
          className="h-[72vh] w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {selectedFeature && (
            <>
              <Marker position={toLatLng(selectedFeature)} icon={defaultMarkerIcon}>
                <Popup>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold">{selectedFeature.properties.nom}</h3>
                    <p className="text-sm">Code INSEE : {selectedFeature.properties.code}</p>
                  </div>
                </Popup>
              </Marker>

              <FitToFeature feature={selectedFeature} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
