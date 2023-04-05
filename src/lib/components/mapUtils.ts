import L from "leaflet";
import { getColor } from "../colorScale";
import type { ColorClass, ElectionOutcome } from "../types";
import { formatVotes } from "../utils";
import type { FeatureCollection } from "geojson";

export function getVotesComunasGeoJSON(electionData: ElectionOutcome[], colorScale: ColorClass[], comunas: FeatureCollection, percentageResults: boolean) {
    if (electionData.length == 0) return L.geoJSON();
    if (comunas.features.length == 0) return L.geoJSON();

    const comunasToMap = [];
    for (const outcome of electionData) {
        let comunaMatch = comunas.features.find(comuna => comuna.properties.nombre == outcome.ComunaName);
        if (comunaMatch) {
            comunaMatch = structuredClone(comunaMatch)
            comunaMatch.properties.votos = percentageResults ? outcome.PercVotes/100 : outcome.Votes;
            comunasToMap.push(comunaMatch);
        }

    }   
    const style = getFeatureStyle(colorScale);
    return L.geoJSON(comunasToMap, {style}); 
}


export function getFeatureStyle(colorScale: ColorClass[]) {
    return function(feature) {
        return {
            fillColor:  getColor(feature.properties.votos, structuredClone(colorScale)),
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.7,
        };
    }
}

export function createMapHoverInfo(electionName: string, percentageResults: boolean) {
    const HoverControl = L.Control.extend({
        onAdd: function (map) {
            this._div = L.DomUtil.create("div", "info");
            this.update();
            return this._div;
        },
        update: function (props) {
            let hoverLabel = `<h4>Elección ${electionName}</h4>
            Pasa el cursor sobre una comuna`;
            if (props) {
                hoverLabel = `<h4>Elección ${electionName}</h4>
                              <b>${props.nombre}</b>
                              <br />
                              ${formatVotes(props.votos, percentageResults, true)}`;
            }
            this._div.innerHTML = hoverLabel;
        },
    });
    return new HoverControl();

}

export function createMapLegend(percentageResults: boolean, colorScale: ColorClass[]) {
    const LegendControl = L.Control.extend({
        onAdd: function (map) {
            this._div = L.DomUtil.create('div', 'info legend');
            const labels = [];
            for (let i = 0; i < colorScale.length; i++) {
                const { color, min, max } = colorScale[i];
                const colorSquare = `<i style="background:${color}"></i>`;
                let votesLabel = formatVotes(min, percentageResults, percentageResults);
                if (min != max) {
                    votesLabel += `&ndash;${formatVotes(max, percentageResults, percentageResults)}`
                }
                labels.push(`${colorSquare} ${votesLabel}`);
            }
            this._div.innerHTML = labels.join('<br>');
            return this._div;
        }
    });
    return new LegendControl({position: 'bottomright'});
}