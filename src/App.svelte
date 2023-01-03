<script lang="ts">
  import ElectoralMap from './lib/components/ElectoralMap.svelte';
  import Form from './lib/components/Form.svelte'
  import { selectedElectionOutcomes } from './lib/state';
</script>

<main>
  <h1>Elecciones Chile Visualizer</h1>
  
  <Form/>
  <ElectoralMap bind:data={$selectedElectionOutcomes}/>

</main>

<style>
</style>