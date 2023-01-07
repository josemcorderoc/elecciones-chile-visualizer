<script lang="ts">
  import ElectoralMap from './lib/components/ElectoralMap.svelte';
  import Form from './lib/components/Form.svelte'
    import Options from './lib/components/Options.svelte';
  import { selectedElectionOutcomes, percentageResults } from './lib/state';
</script>

<main>
  <h1>Elecciones Chile Visualizer</h1>
  
  <Form/>
  <ElectoralMap bind:data={$selectedElectionOutcomes} bind:percentageResults={$percentageResults}/>
  <Options/>
</main>

<style>
</style>