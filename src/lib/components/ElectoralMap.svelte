<script lang="ts">
    import L from "leaflet";
    import type { ElectionOutcome } from "../types";
    import { getVotesComunasGeoJSON } from "./electoralMap";
    import { selectedElectionNames } from "../state";
    import { generateColorScale } from "../colorScale";
    import { formatVotes } from "../utils";

    export let data: ElectionOutcome[] = [];
    export let percentageResults: boolean;
    $: colorScale = generateColorScale(data.map(e => e.votes));
    let map: L.Map;

    const hoverControl = L.Control.extend({
            onAdd: function (map) {
                this._div = L.DomUtil.create("div", "info");
                this.update();
                return this._div;
            },
            update: function (props) {
                let hoverLabel = "Pasa el cursor sobre una comuna";
                if (props) {
                    hoverLabel = `<h4>Elección ${$selectedElectionNames[0]}</h4>
                                  <b>${props.nombre}</b>
                                  <br />
                                  ${formatVotes(props.votos, percentageResults, true)}`;
                }
                this._div.innerHTML = hoverLabel;
            },
    });

    const legendControl = L.Control.extend({
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

    function removeMapItems(map, geojson, legend) {
        if (legend) map.removeControl(legend);
        if (geojson) geojson.removeFrom(map);
    }

    function renderElectionOutcome(data, map, hover) {
        if (data.length == 0) return [null, null, null];

        const comunasGeoJSON = getVotesComunasGeoJSON(data);
        comunasGeoJSON.addTo(map);
        
        map.fitBounds(comunasGeoJSON.getBounds());
      
        const legend = new legendControl({position: 'bottomright'});
        legend.addTo(map);

        function resetHighlight(e) {
            comunasGeoJSON.resetStyle(e.target);
            hover.update();
        }

        function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
        }

        function highlightFeature(e) {
            const layer = e.target;

            layer.setStyle({
                weight: 5,
                color: "#666",
                dashArray: "",
                fillOpacity: 0.7
            });
            layer.bringToFront();
            hover.update(layer.feature.properties);
        }

        comunasGeoJSON.eachLayer(function (layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        });

        return [comunasGeoJSON, legend];
    }

    function initMap(node: HTMLElement, data) {
        let initialView = L.latLng(-33.43785, -70.65049);
        map = L.map(node).setView(initialView, 10);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        map.attributionControl.addAttribution(
            'Datos electorales: <a href="https://www.servel.cl/">Servicio Electoral de Chile (Servel)</a>'
        );

        const hover = new hoverControl();
        hover.addTo(map);

        let [comunasGeoJSON, legend] = renderElectionOutcome(data, map, hover);

        return {
            update(data) {
                removeMapItems(map, comunasGeoJSON, legend);
                [comunasGeoJSON, legend] = renderElectionOutcome(data, map, hover);
            },
            destroy() {
                removeMapItems(map, comunasGeoJSON, legend);
                map.off();
                map.remove();
            },
        };
    }
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
        integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
        crossorigin=""
    />
</svelte:head>

<div id="map" use:initMap={data} />

<style>
    #map {
        height: 500px;
        /* z-index: -1; */
    }
    div :global(.info) {
        padding: 6px 8px;
        font: 14px/16px Arial, Helvetica, sans-serif;
        background: white;
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        border-radius: 5px;
    }
    div :global(.info h4) {
        margin: 0 0 5px;
        color: #777;
    }

    div :global(.legend) {
        line-height: 18px;
        color: #555;
    }
    div :global(.legend i) {
        width: 18px;
        height: 18px;
        float: left;
        margin-right: 8px;
        opacity: 0.7;
    }
</style>
