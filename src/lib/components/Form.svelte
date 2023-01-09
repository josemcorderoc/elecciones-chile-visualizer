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

    export let electionNames: string[];
    export let comunaNames: string[];
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
            bind:tags={$selectedComunaNames}
            autoComplete={comunaNames}
            addKeys={[9, 13]}
            placeholder={"Ingresa una o más comunas"}
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
