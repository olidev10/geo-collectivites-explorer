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
    <MapContainer
      center={[46.6, 2.4]}
      zoom={6}
      className="h-[70vh] w-full rounded-2xl"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {selectedFeature && (
        <>
          <Marker position={toLatLng(selectedFeature)} icon={defaultMarkerIcon}>
            <Popup>
              <div>
                <h3>{selectedFeature.properties.nom}</h3>
                <p>Code INSEE : {selectedFeature.properties.code}</p>
              </div>
            </Popup>
          </Marker>

          <FitToFeature feature={selectedFeature} />
        </>
      )}
    </MapContainer>
  );
}
