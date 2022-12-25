import type { FeatureCollection } from "geojson";
import type { ResultadoEleccion } from "../../types/electoral";

/**
 * 
 * @param comunas GeoJSON with all Chilean communes
 * @param electionData Votes of candidates in an election by commune
 * @returns 
 */
export function getVotesComunasGeoJSON(comunas: FeatureCollection, electionData: ResultadoEleccion[]) {
    // TODO filter comunas using data
    let uniqueComunas = new Set(electionData.map((resultado) => resultado.comuna));
    
    let comunasToMap = comunas.features.filter((comuna) =>
        uniqueComunas.has(comuna.properties.cod_comuna)
    );

    // add votes into comunas and return
    comunasToMap.forEach(
        (comuna) =>
            (comuna.properties.votos = electionData.find(
                (result) => result.comuna == comuna.properties.cod_comuna
            ).votos)
    );

    return comunasToMap;
}

function generateColorScale(electionData: ResultadoEleccion[]) {
    return function getColor(d) {
        return d > 1000
            ? "#800026"
            : d > 500
            ? "#BD0026"
            : d > 200
            ? "#E31A1C"
            : d > 100
            ? "#FC4E2A"
            : d > 50
            ? "#FD8D3C"
            : d > 20
            ? "#FEB24C"
            : d > 10
            ? "#FED976"
            : "#FFEDA0";
    }
}