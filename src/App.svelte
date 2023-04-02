<script lang="ts">
  import type { FeatureCollection } from "geojson";
  import { onMount } from "svelte";
  import ElectoralMap from "./lib/components/ElectoralMap.svelte";
  import Form from "./lib/components/Form.svelte";
  import Loading from "./lib/components/Loading.svelte";
    import { electionNames } from "./lib/constants";
  import {
    selectedElectionOutcomes,
    percentageResults,
    loadingComunasGeoJSON,
    loadingShowInUI
  } from "./lib/state";
  import type { Comuna } from "./lib/types";

  let comunasFeatures: FeatureCollection;
  let comunas: Comuna[];

  onMount(async () => {
    $loadingComunasGeoJSON = true;
    comunasFeatures = await fetch(
        "https://elecciones-chile-visualizer-1.s3.sa-east-1.amazonaws.com/data/comunas.json.gz"
      ).then((response) => response.json()
    );

    comunas = comunasFeatures.features.map(c => ({
      nombre: c.properties.nombre,
      distrito: c.properties.distrito,
      region: c.properties.region
    } as Comuna));
    $loadingComunasGeoJSON = false;
  });
</script>

<main>
  <h1>Elecciones Chile Visualizer</h1>

  
  <Form {electionNames} {comunas}/>
  {#if $loadingShowInUI}
  <div class="my-2">
    <Loading />
  </div>
  {/if}
  <ElectoralMap
    bind:data={$selectedElectionOutcomes}
    bind:percentageResults={$percentageResults}
    comunas={comunasFeatures}
  />
</main>

<style>
</style>