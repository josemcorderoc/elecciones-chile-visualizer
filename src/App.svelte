<script lang="ts">
  import Form from "./lib/components/Form.svelte";
  import Loading from "./lib/components/Loading.svelte";
  import { electionNames } from "./lib/constants";
  import {

    percentageResults,
    loadingShowInUI,
    selectedElectionNames,
    electionOutcomesElectionComunaTotal,
    selectedEntityNames,
  } from "./lib/state";
  import Maps from "./lib/components/Maps.svelte";

</script>

<main>
  

  <div id="form">
    <h1>Elecciones Chile Visualizer</h1>
    
    <Form {electionNames}/>
    {#if $loadingShowInUI}
    <div class="my-2">
      <Loading />
    </div>
    {/if}
</div>
  <Maps
    bind:data={$electionOutcomesElectionComunaTotal}
    bind:percentageResults={$percentageResults}
    entityNames={$selectedEntityNames}
    electionNames={$selectedElectionNames}
  />
</main>

<style>
  #form {
  max-width: 1280px;
  margin: 0 auto;
  padding-top: 2rem;
  /* text-align: center; */
}
</style>