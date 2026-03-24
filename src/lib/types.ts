import { Feature, Point } from "geojson";

export type CommuneCollection = {
  type: "FeatureCollection";
  features: {
    type: Feature;
    geometry: Point;
    properties: {
      code: string; // Code INSEE
      nom: string; // Nom de la commune
      codeDepartement: string;
      codeRegion: string;
      population?: number;
      type?: string[]; // Ex: ["commune", "chef-lieu", "sous-prefecture"]
    };
  }[];
};