<script lang="ts">
    import L from "leaflet";
    import type { ElectionOutcome } from "../types";
    import { colorPalette, selectedElectionNames } from "../state";
    import { generateColorScale } from "../colorScale";
    import { createMapHoverInfo, createMapLegend, getFeatureStyle, getVotesComunasGeoJSON } from "./mapUtils";
    import type { FeatureCollection } from "geojson";

    export let data: ElectionOutcome[] = [];
    export let percentageResults: boolean;
    export let comunas: FeatureCollection;

    let map: L.Map;

    $: mapParams = {
        data,
        percentageResults: percentageResults,
        colorScale: generateColorScale(data.map(e => e.votes), $colorPalette)
    }

    function removeMapItems(map, geojson, legend, hover) {
        if (legend) map.removeControl(legend);
        if (hover) map.removeControl(hover);
        if (geojson) geojson.removeFrom(map);
    }

    function renderElectionOutcome(params, map) {
        if (params.data.length == 0) return [null, null, null];

        const comunasGeoJSON = getVotesComunasGeoJSON(params.data, params.colorScale, comunas);
        comunasGeoJSON.addTo(map);
        
        map.fitBounds(comunasGeoJSON.getBounds());
        
        const hover = createMapHoverInfo($selectedElectionNames[0], percentageResults);
        hover.addTo(map);
        // const legend = new legendControl({position: 'bottomright'});
        const legend = createMapLegend(percentageResults, params.colorScale)
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

        return [comunasGeoJSON, legend, hover];
    }

    function initMap(node: HTMLElement, params) {
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

        let [comunasGeoJSON, legend, hover] = renderElectionOutcome(params, map);

        return {
            update(params) {
                removeMapItems(map, comunasGeoJSON, legend, hover);
                [comunasGeoJSON, legend, hover] = renderElectionOutcome(params, map);
            },
            destroy() {
                removeMapItems(map, comunasGeoJSON, legend, hover);
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

<div id="map" use:initMap={mapParams} />

<style>
    #map {
        height: 500px;
        text-align: center;
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
