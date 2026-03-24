"use client";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Popup,
  useMap,
  Marker,
} from "react-leaflet";
import { useEffect } from "react";
import { CommuneCollection } from "@/lib/types";

function FitToFeature({ feature }: { feature: CommuneCollection["features"][0] | null }) {
  const map = useMap();

  useEffect(() => {
    if (!feature) return;

    const coords = feature.geometry.coordinates;

    map.fitBounds(coords);
  }, [feature, map]);

  return null;
}

export default function MapView({ selectedFeature }: { selectedFeature: CommuneCollection["features"][0] | null }) {
  return (
    <MapContainer
      center={[46.6, 2.4]}
      zoom={6}
      className="h-[70vh] w-full rounded-2xl"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {selectedFeature && (
        <>
          <GeoJSON
            data={selectedFeature.geometry}
            style={{
              color: "#2563eb",
              weight: 2,
              fillOpacity: 0.2,
            }}
          >
            <Marker position={selectedFeature.geometry.coordinates} >
                <Popup>
                <div>
                    <h3>{selectedFeature.properties.nom}</h3>
                    <p>Code INSEE : {selectedFeature.properties.code}</p>
                </div>
                </Popup>
            </Marker>
          </GeoJSON>

          <FitToFeature feature={selectedFeature} />
        </>
      )}
    </MapContainer>
  );
}