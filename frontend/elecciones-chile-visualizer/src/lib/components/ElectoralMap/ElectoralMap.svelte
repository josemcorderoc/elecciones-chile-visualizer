<script lang="ts">
    import L from "leaflet";
    import type { ElectionOutcome } from "../../types";
    import { getLegend, getVotesComunasGeoJSON } from "./electoralMap";
    import { selectedElectionNames } from "../../state";

    export let data: ElectionOutcome[] = [];
    // export let territorio, entidad: string;
    
    let initialView = L.latLng(-33.43785, -70.65049);

    function initMap(node: HTMLElement, data) {

        let geojson1 = getVotesComunasGeoJSON(data);
        let map = L.map(node).setView(initialView, 10);

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
                    ? `<b>${props.nombre}</b><br />${props.votos.toLocaleString('es-CL')} votos`
                    : "Pasa el cursor sobre una comuna";
                const eleccion = props ? `<h4>Elección ${$selectedElectionNames[0]}</h4>` : "";
                this._div.innerHTML = `${eleccion}${contents}`;
            },
        });

        let control = new myControl();
        control.addTo(map);

        let legend = getLegend(data);
        legend.addTo(map);

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
                
        if (data.length > 0) {
            geojson1.addTo(map);
            map.fitBounds(geojson1.getBounds());

            function resetHighlight(e) {
                geojson1.resetStyle(e.target);
                control.update();
            }

            function zoomToFeature(e) {
                map.fitBounds(e.target.getBounds());
            }

            geojson1.eachLayer(function(layer) {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: zoomToFeature
                });
            })

        }
       
        map.attributionControl.addAttribution('Fuente: <a href="https://www.servel.cl/">Servicio Electoral de Chile (Servel)</a>');

        
        return {
			update(data) {
                geojson1.removeFrom(map);
                geojson1 = getVotesComunasGeoJSON(data);

                map.removeControl(legend);
                


                if (data.length > 0) {
                    geojson1.addTo(map);
                    map.fitBounds(geojson1.getBounds());
                    
                    legend = getLegend(data);
                    legend.addTo(map)

                    function resetHighlight(e) {
                        geojson1.resetStyle(e.target);
                        control.update();
                    }

                    function zoomToFeature(e) {
                        map.fitBounds(e.target.getBounds());
                    }

                    geojson1.eachLayer(function(layer) {
                        layer.on({
                            mouseover: highlightFeature,
                            mouseout: resetHighlight,
                            click: zoomToFeature
                        });
                    })
                }
			},

			destroy() {
				// the node has been removed from the DOM
			}
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
