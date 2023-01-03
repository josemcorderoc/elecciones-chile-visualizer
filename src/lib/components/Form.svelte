<script lang="ts">
    import Tags from "svelte-tags-input";
    import { comunaNames, electionNames, elections } from "../constants";
    import {
        selectedElectionNames,
        selectedCandidateNames,
        selectedComunaNames,
        candidateNamesAutocomplete,
    } from "../state";
</script>

<div class="container election-form">
    <div class="col">
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

    <div class="col">
        <Tags
            bind:tags={$selectedComunaNames}
            autoComplete={comunaNames}
            addKeys={[9, 13]}
            placeholder={"Ingresa una o más comunas"}
            onlyAutocomplete
            onlyUnique
        />
    </div>

    <div class="col">
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
    <!-- <button on:click={resetAllTags}>Reset</button> -->
</div>

<style>
    .election-form :global(.svelte-tags-input-matchs-parent) {
        z-index: 10000;
    }
</style>
