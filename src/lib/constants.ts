import type { FeatureCollection } from "geojson";
import elecciones_data from "../assets/elecciones.json";
import comunas_data from "../assets/comunas.json";
import type { Elections } from "./types";

export const elections = <Elections>elecciones_data;
export const comunas = <FeatureCollection>comunas_data;

export const electionNames = Object.keys(elections);
export const comunaNames = <string[]>comunas.features.map(comuna => comuna.properties.nombre);