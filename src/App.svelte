<script lang="ts">
  import type { FeatureCollection } from "geojson";
  import { onMount } from "svelte";
  import ElectoralMap from "./lib/components/ElectoralMap.svelte";
  import Form from "./lib/components/Form.svelte";
  import Loading from "./lib/components/Loading.svelte";
  import {
    selectedElectionOutcomes,
    percentageResults,
    elections,
  } from "./lib/state";
  import type { Elections } from "./lib/types";

  let comunas: FeatureCollection;
  let comunaNames: string[];
  let electionNames: string[];
  let loading = true;

  onMount(async () => {
    let [electionsData, comunasData] = await Promise.all([
      fetch(
        "https://elecciones-chile-visualizer-1.s3.sa-east-1.amazonaws.com/data/elecciones.json.gz"
      ).then((response) => response.json()),
      fetch(
        "https://elecciones-chile-visualizer-1.s3.sa-east-1.amazonaws.com/data/comunas.json.gz"
      ).then((response) => response.json()),
    ]);
    $elections = <Elections>electionsData;
    comunas = comunasData;
    
    electionNames = Object.keys($elections);
    comunaNames = comunas.features.map(comuna => comuna.properties.nombre);
    loading = false;
  });
</script>

<main>
  <h1>Elecciones Chile Visualizer</h1>

  {#if loading}
  <div class="my-2">
    <Loading />
  </div>
  {/if}
  <Form {electionNames} {comunaNames}/>
  <ElectoralMap
    bind:data={$selectedElectionOutcomes}
    bind:percentageResults={$percentageResults}
    {comunas}
  />
</main>

<style>
</style>