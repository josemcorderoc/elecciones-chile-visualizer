<script lang="ts">
  import Form from "./lib/components/Form.svelte";
  import Loading from "./lib/components/Loading.svelte";
  import { electionNames } from "./lib/constants";

  import {
    electionOutcomesElectionComunaTotal,
    loadingShowInUI,
    percentageResults,
    selectedElectionNames,
    selectedEntityNames,
    selectedElectionOutcomes,
    tableView


  } from "./lib/state";
  import Maps from "./lib/components/Maps.svelte";
  import ElectoralDatatable from "./lib/components/ElectoralDatatable.svelte";
  import ElectoralBarPlot from "./lib/components/ElectoralBarPlot.svelte";

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
    <div class="mt-8">
      {#if $tableView}
        <ElectoralDatatable data={$selectedElectionOutcomes}/>
      {:else}
        <div class="grid grid-cols-2 gap-5">    
          <div class="col-span-1">
            <ElectoralBarPlot bind:data={$selectedElectionOutcomes} percentageResults={$percentageResults}/>
          </div>
          <div class="col-span-1">
            <Maps
              bind:data={$electionOutcomesElectionComunaTotal}
              bind:percentageResults={$percentageResults}
              entityNames={$selectedEntityNames}
              electionNames={$selectedElectionNames}
            />
          </div>
        </div>
      {/if}
    </div>
  
</main>

<style>
  #form {
  /* max-width: 1280px; */
  max-width: 90%;
  margin: 0 auto;
  padding-top: 2rem;
  /* text-align: center; */
}
</style>