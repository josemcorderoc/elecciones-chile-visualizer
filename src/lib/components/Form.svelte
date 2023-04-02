<script lang="ts">
    import Tags from "svelte-tags-input";
    import Switch from "svelte-switch";
    import {
        selectedElectionNames,
        selectedCandidateNames,
        selectedComunaNames,
        candidateNamesAutocomplete,
        percentageResults,
    } from "../state";
    import type { Comuna } from "../types";

    export let electionNames: string[];
    export let comunas: Comuna[] = [];
    let selectedTerritorioNames: string[] = [];
    let selectedTerritorioNamesStr: string = "";

    function getTerritorios(comunasTotal: Comuna[]){        
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

    $: territoriosMap = getTerritorios(comunas);
    $: territorioNames = Array.from(territoriosMap.keys()).sort();
    
    // logic to work with strings and avoid double reativity,
    // see https://github.com/sveltejs/svelte/issues/4265
    $: selectedTerritorioNamesStr = selectedTerritorioNames.join(",")
    $: $selectedComunaNames = selectedTerritorioNamesStr.length > 0 ? selectedTerritorioNamesStr.split(",") : []
    
</script>

<div class="election-form">
    <div>
        <Tags
            bind:tags={$selectedElectionNames}
            autoComplete={electionNames}
            addKeys={[9, 13]}
            placeholder={"Ingresa una elección"}
            onlyAutocomplete
            onlyUnique
            maxTags={1}
        />
    </div>

    <div>
        <Tags
            bind:tags={selectedTerritorioNames}
            on:update:tags={() => console.log("AAA")}
            autoComplete={territorioNames}
            addKeys={[9, 13]}
            placeholder={"Ingresa uno o más territorios (comunas, distritos, regiones)"}
            onlyAutocomplete
            onlyUnique
        />
    </div>

    <div>
        <Tags
            bind:tags={$selectedCandidateNames}
            autoComplete={$candidateNamesAutocomplete}
            addKeys={[9, 13]}
            placeholder={"Ingresa un candidato"}
            maxTags={1}
            onlyAutocomplete
            onlyUnique
        />
    </div>

    <div class="mt-1 ml-2">
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
    </div>
</div>

<style>
    .election-form {
        width: 0;
        min-width: 100%;
        /* max-width: 500px;    */
        display:inline-block;
    }
    .election-form :global(.svelte-tags-input-matchs-parent) {
        z-index: 10000;
    }
</style>
