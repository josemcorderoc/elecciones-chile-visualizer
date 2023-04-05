<script lang="ts">
    import type { ElectionOutcome } from "../types";
    import ElectoralMap from "./ElectoralMap.svelte";

    export let percentageResults = false;
    export let data: ElectionOutcome[];
    export let entityNames;
    export let electionNames;
    
    $: entityName = entityNames[0];
    
    let dataByElectionName = new Map<string, ElectionOutcome[]>();
    
    $:{
        dataByElectionName = new Map(
            electionNames
            .map(electionName => 
                [electionName,
                data.filter(
                    outcome => ((outcome.ElectionName == electionName) &&
                                (outcome.EntityName == entityName))
        )]))
    }
</script>

<div class="grid grid-cols-auto gap-4 grid-flow-col auto-cols-auto">
    {#each electionNames as electionName}
        
        <div class="col-auto">
            <ElectoralMap
                {electionName}
                data={dataByElectionName.get(electionName)}
                {percentageResults}
            />
        </div>
    {/each}
</div>