import type { FeatureCollection } from "geojson";
import L from "leaflet";
import { comunaNames, comunas, viridis } from "../constants";
import type { ElectionOutcome } from "../types";
import { jenks } from 'simple-statistics'


function getColor(votes: number, colorScale) {
    for (let i = 0; i < colorScale.length; i++) {
        const interval = colorScale[i];
        if (votes <= interval.max) {
            return interval.color;
        }   
    }
    throw new Error(`Could not find color for value ${votes}.`);
}

function getStyle(electionData: ElectionOutcome[]) {

    const colorScale = generateColorScale(electionData);

    return feature => ({
        fillColor:  getColor(feature.properties.votos, colorScale),
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
});
}

export function getLegend(electionData) {
    const colorScale = generateColorScale(electionData);
    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        const labels = [];
        for (let i = 0; i < colorScale.length; i++) {
            const { color, min, max } = colorScale[i];
            // const min = interval.min.toLocaleString('es-CL')
            // const max = interval.max.toLocaleString('es-CL')
            labels.push(`<i style="background:${color}"></i> ${min.toLocaleString('es-CL')}${min != max ? `&ndash;${max.toLocaleString('es-CL')}` : ''}`);
        }
        div.innerHTML = labels.join('<br>');
        return div;
    };
    return legend
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

function generateColorScale(electionData: ElectionOutcome[]) {
    if (electionData.length == 0) return [];

    const votes = electionData.map(e => e.votes);
    const nClasses = Math.min(electionData.length, 5);
    const classBreaks = jenks(votes, nClasses);
    const maxBreak = classBreaks.at(-2);
    const breaksColors = [];

    for (let i = 0; i < nClasses; i++) {
        const perc = Math.floor(classBreaks[i]*100.0/maxBreak);
        
        const interval = {
            min: classBreaks[i],
            max: classBreaks[i+1],
            color: viridis[perc]
        }

        if (i < nClasses - 1) {
            interval.max--;
        }

        breaksColors.push(interval)
    }

    return breaksColors;
}