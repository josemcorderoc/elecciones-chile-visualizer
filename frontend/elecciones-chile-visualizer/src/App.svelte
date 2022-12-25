<script lang="ts">
  import ElectoralMap from './lib/components/ElectoralMap/ElectoralMap.svelte';
  import data from "./assets/test_votes.json";
  console.log(data);

  
</script>

<main>
  <h1>Elecciones Chile Visualizer</h1>

  <ElectoralMap data={data.data} territorio={"comuna"} entidad={"candidato"}/>

</main>

<style>
</style>