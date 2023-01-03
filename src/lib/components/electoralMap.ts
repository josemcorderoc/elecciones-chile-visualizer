import L from "leaflet";
import { generateColorScale, getColor } from "../colorScale";
import { comunas } from "../constants";
import type { ElectionOutcome } from "../types";


function getStyle(electionData: ElectionOutcome[]) {

    const colorScale = generateColorScale(electionData.map(e => e.votes));

    return feature => ({
        fillColor:  getColor(feature.properties.votos, colorScale),
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
    });
}

/**
 * 
 * @param comunas GeoJSON with all Chilean communes
 * @param electionData Votes of candidates in an election by commune
 * @returns 
 */
export function getVotesComunasGeoJSON(electionData: ElectionOutcome[]) {
    if (electionData.length == 0) return L.geoJSON();

    const comunasToMap = [];
    for (const outcome of electionData) {
        let comunaMatch = comunas.features.find(comuna => comuna.properties.nombre == outcome.comuna);
        if (comunaMatch) {
            comunaMatch = Object.assign({}, comunaMatch);
            comunaMatch.properties.votos = outcome.votes;
            comunasToMap.push(comunaMatch);
        }

    }   
    const style = getStyle(electionData)
    return L.geoJSON(comunasToMap, {style});
}
