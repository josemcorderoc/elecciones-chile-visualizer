<script lang="ts">
    // Input: geojson que contiene comunas, votos, tyle
    import L from "leaflet";
    import type { FeatureCollection } from "geojson";
    import comunas_chile from "../../../assets/comunas.json";
    import type { ResultadoEleccion } from "../../types/electoral";

    import { getVotesComunasGeoJSON } from "./electoralMap";


    // export let comunas: FeatureCollection;
    export let data: ResultadoEleccion[];
    export let territorio, entidad: string;

    let comunasToMap = getVotesComunasGeoJSON(<FeatureCollection>comunas_chile, data);
        console.log(comunasToMap);
        
    // TODO use color types
    // export let colorScale: (votes: number) => string;
    function getColor(d) {
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

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.votos),
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.7,
        };
    }

    // initialize map

    let initialView = L.latLng(51.505, -0.09);

    function initMap(node: HTMLElement) {
        let map = L.map(node).setView(initialView, 15);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        // control that shows state info on hover
        // const info = L.control();

        const myControl = L.Control.extend({
            onAdd: function (map) {
                this._div = L.DomUtil.create("div", "info");
                this.update();
                return this._div;
            },
            update: function (props) {
                const contents = props
                    ? `<b>${props.Comuna}</b><br />${props.votos} votos`
                    : "Hover over a state";
                this._div.innerHTML = `<h4>Elección X</h4>${contents}`;
            },
        });

        let control = new myControl();
        control.addTo(map);


        function highlightFeature(e) {
            const layer = e.target;

            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

            layer.bringToFront();

            control.update(layer.feature.properties);
        }

        /* global statesData */
        const geojson = L.geoJSON(comunasToMap, {style, onEachFeature});

        geojson.addTo(map);
        map.fitBounds(geojson.getBounds());
        function resetHighlight(e) {
            geojson.resetStyle(e.target);
            control.update();
        }

        function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }

        map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">Servicio Electoral de Chile (Servel)</a>');

        const legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {

            const div = L.DomUtil.create('div', 'info legend');
            const grades = [0, 10, 20, 50, 100, 200, 500, 1000];
            const labels = [];
            let from, to;

            for (let i = 0; i < grades.length; i++) {
                from = grades[i];
                to = grades[i + 1];

                labels.push(`<i style="background:${getColor(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`);
            }

            div.innerHTML = labels.join('<br>');
            return div;
        };

        legend.addTo(map);
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

<div id="map" use:initMap />

<style>
    #map {
        height: 500px;
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
    .legend {
        text-align: left;
        line-height: 18px;
        color: #555;
    }
    .legend i {
        width: 18px;
        height: 18px;
        float: left;
        margin-right: 8px;
        opacity: 0.7;
    }
</style>
