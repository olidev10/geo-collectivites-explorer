import { CommuneCollection } from "@/lib/types";

type Props = {
  feature: CommuneCollection["features"][0] | null;
};

export default function InfoPanel({ feature }: Props) {
  if (!feature) {
    return (
      <div className="glass-panel rounded-[28px] p-5 sm:p-6">
        <p className="section-label text-xs font-bold">Details</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Informations territoriales</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Selectionnez une commune dans la liste pour afficher son profil administratif et
          les notions SIG associees.
        </p>
      </div>
    );
  }

  const p = feature.properties;

  return (
    <div className="glass-panel rounded-[28px] p-5 sm:p-6">
      <div className="space-y-6">
        <div>
          <p className="section-label text-xs font-bold">Fiche commune</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">{p.nom}</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Code INSEE</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{p.code}</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Departement</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{p.codeDepartement}</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Region</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{p.codeRegion}</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Population</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{p.population ?? "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
