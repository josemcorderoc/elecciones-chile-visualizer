<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
    integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
    crossorigin=""/>
</svelte:head>

<script lang="ts">
    import data from '../assets/comunas.geojson';
    console.log(data.type);

    import L from 'leaflet';
    
    let initialView = L.latLng(51.505, -0.09);
    
    function initMap(node: HTMLElement) {
        let map = L.map(node).setView(initialView, 15);
        
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        let marker = L.marker([51.5, -0.09]).addTo(map);

        let circle = L.circle([51.508, -0.11], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500
        }).addTo(map);

        let polygon = L.polygon([
            [51.509, -0.08],
            [51.503, -0.06],
            [51.51, -0.047]
        ]).addTo(map);
        
        map.fitBounds(polygon.getBounds());
        
    }
</script>

<div id="map" use:initMap></div>

<style>
    #map { height: 500px; }
</style>