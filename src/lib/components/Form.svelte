<script lang="ts">
    import Tags from "svelte-tags-input";
    import Switch from "svelte-switch";
    import { comunaNames, electionNames } from "../constants";
    import {
        selectedElectionNames,
        selectedCandidateNames,
        selectedComunaNames,
        candidateNamesAutocomplete,
        percentageResults,
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

    Votos
    <Switch
        bind:checked={$percentageResults}
        onColor="#888888"
        handleDiameter={20}
        unCheckedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        height={15}
        width={40}
        id="material-switch"
    >
        <span slot="checkedIcon" />
        <span slot="unCheckedIcon" />
    </Switch>
    %
    <!-- The switch is {checkedValue ? 'on' : 'off'}. -->
    <!-- <button on:click={resetAllTags}>Reset</button> -->
</div>

<style>
    .election-form :global(.svelte-tags-input-matchs-parent) {
        z-index: 10000;
    }
</style>
