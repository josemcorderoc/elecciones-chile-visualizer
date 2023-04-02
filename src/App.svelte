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
  } from "./lib/state";
  import type { Comuna } from "./lib/types";

  let comunasFeatures: FeatureCollection;
  let comunaNames: string[];
  let loading = true;
  let comunas: Comuna[];

  onMount(async () => {
    comunasFeatures = await fetch(
        "https://elecciones-chile-visualizer-1.s3.sa-east-1.amazonaws.com/data/comunas.json.gz"
      ).then((response) => response.json()
    );

    comunas = comunasFeatures.features.map(c => ({
      nombre: c.properties.nombre,
      distrito: c.properties.distrito,
      region: c.properties.region
    } as Comuna));

    comunaNames = comunasFeatures.features.map(comuna => comuna.properties.nombre);
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
  <Form {electionNames} {comunas}/>
  <ElectoralMap
    bind:data={$selectedElectionOutcomes}
    bind:percentageResults={$percentageResults}
    comunas={comunasFeatures}
  />
</main>

<style>
</style>