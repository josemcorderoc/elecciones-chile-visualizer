<script lang="ts">
    import Tags from "svelte-tags-input";
    import Switch from "svelte-switch";
    import {
        selectedElectionNames,
        selectedEntityNames,
        selectedComunaNames,
        candidateNamesAutocomplete,
        percentageResults,
        loadingQuery,
        loadingComunasGeoJSON,
        candidateTypeResults,
        comunas,
        tableView,
    } from "../state";
    import type { Comuna } from "../types";

    export let electionNames: string[];
    let selectedTerritorioNames: string[] = [];
    let selectedTerritorioNamesStr: string = "";

    function getTerritorios(comunasTotal: Comuna[]){
        // maps keys contains the territory name and the value
        // is a set with comuna names
        const comunasMap = new Map<string, Set<string>>();
        const distritosMap = new Map<string, Set<string>>();
        const regionesMap = new Map<string, Set<string>>();

        comunasTotal.forEach(comuna => {
            // comunas
            comunasMap.set(comuna.nombre, new Set([comuna.nombre]))

            // distritos
            const distrito = `Distrito ${comuna.distrito}`;
            if (distritosMap.has(distrito)) {
                distritosMap.get(distrito).add(comuna.nombre);
            } else {
                distritosMap.set(distrito, new Set([comuna.nombre]));
            }

            // regiones
            const region = `Región ${comuna.region}`;
            if (regionesMap.has(region)) {
                regionesMap.get(region).add(comuna.nombre);
            } else {
                regionesMap.set(region, new Set([comuna.nombre]));
            }
        });
        return new Map([...comunasMap, ...distritosMap, ...regionesMap]);
    }

    $: territoriosMap = getTerritorios($comunas);
    $: territorioNames = Array.from(territoriosMap.keys()).sort();
    
    function getComunasNamesFromTerritorioNames(territorioNames: string[], territoriosMap: Map<string, Set<string>>) {
        const comunas = territorioNames.map(t => territoriosMap.get(t));
        return [...new Set(comunas.reduce((acc, curr) => [...acc, ...curr], []))];
    }
    // logic to work with strings and avoid double reativity,
    // see https://github.com/sveltejs/svelte/issues/4265
    $: selectedTerritorioNamesStr = selectedTerritorioNames.join(",")
    $: $selectedComunaNames = selectedTerritorioNamesStr.length > 0
            ? getComunasNamesFromTerritorioNames(selectedTerritorioNamesStr.split(","), territoriosMap)
            : []
    
</script>

<div class="election-form">
    <div>
        <div class="mt-5 mb-1 ml-2">
            Partidos
            <Switch
                bind:checked={$candidateTypeResults}
                onColor="#888888"
                handleDiameter={15}
                unCheckedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={10}
                width={30}
                id="apiType-switch"
            >
                <span slot="checkedIcon" />
                <span slot="unCheckedIcon" />
            </Switch>
            Candidatos
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp
            Votos
            <Switch
                bind:checked={$percentageResults}
                onColor="#888888"
                handleDiameter={15}
                unCheckedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={10}
                width={30}
                id="percentage-switch"
            >
                <span slot="checkedIcon" />
                <span slot="unCheckedIcon" />
            </Switch>
            %
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp
            Mapa
            <Switch
                bind:checked={$tableView}
                onColor="#888888"
                handleDiameter={15}
                unCheckedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={10}
                width={30}
                id="percentage-switch"
            >
                <span slot="checkedIcon" />
                <span slot="unCheckedIcon" />
            </Switch>
            Tabla

        </div>
        <Tags
            bind:tags={$selectedElectionNames}
            autoComplete={electionNames}
            addKeys={[9, 13]}
            placeholder={"Ingresa una o más elecciones"}
            onlyAutocomplete
            onlyUnique
        />
    </div>

    <div>
        <Tags
            bind:tags={selectedTerritorioNames}
            autoComplete={territorioNames}
            addKeys={[9, 13]}
            placeholder={"Ingresa uno o más territorios (comunas, distritos, regiones)"}
            onlyAutocomplete
            onlyUnique
            bind:disable={$loadingComunasGeoJSON}
        />
    </div>

    <div>
        <Tags
            bind:tags={$selectedEntityNames}
            autoComplete={$candidateNamesAutocomplete}
            addKeys={[9, 13]}
            placeholder={`Ingresa un ${$candidateTypeResults ? "candidato" : "partido"}`}
            maxTags={1}
            onlyAutocomplete
            onlyUnique
            bind:disable={$loadingQuery}
        />
    </div>

    <div class="mt-1 ml-2">
        
    </div>
</div>

<style>
    .election-form {
        /* width: 0; */
        min-width: 100%;
        /* max-width: 500px;    */
        display:inline-block;
    }
    .election-form :global(.svelte-tags-input-matchs-parent) {
        z-index: 10000;
    }
</style>
