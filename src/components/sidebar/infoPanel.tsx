import { CommuneCollection } from "@/lib/types";

type Props = {
  feature: CommuneCollection["features"][0] | null;
};

export default function InfoPanel({ feature }: Props) {
  if (!feature) {
    return (
      <div className="rounded-2xl border bg-white p-5">
        <h2 className="mb-2 text-lg font-semibold">Informations</h2>
        <p className="text-sm text-slate-600">
          Sélectionne une commune pour afficher ses informations.
        </p>
      </div>
    );
  }

  const p = feature.properties;

  return (
    <div className="rounded-2xl border bg-white p-5 space-y-3">
      <h2 className="text-lg font-semibold">{p.nom}</h2>
      <div className="text-sm text-slate-700 space-y-1">
        <p><strong>Code INSEE :</strong> {p.code}</p>
        <p><strong>Département :</strong> {p.codeDepartement}</p>
        <p><strong>Région :</strong> {p.codeRegion}</p>
        <p><strong>Population :</strong> {p.population ?? "N/A"}</p>
        <p><strong>Type :</strong> {feature.geometry?.type ?? "N/A"}</p>
      </div>

      <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
        <p><strong>Notions SIG mobilisées :</strong></p>
        <ul className="list-disc pl-5">
          <li>GeoJSON</li>
          <li>Couche vecteur</li>
          <li>Référentiel administratif</li>
          <li>Carte interactive</li>
        </ul>
      </div>
    </div>
  );
}