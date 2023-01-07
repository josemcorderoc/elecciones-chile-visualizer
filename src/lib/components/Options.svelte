<script>
    import { ThreeDots } from "svelte-bootstrap-icons";
    import Select from 'svelte-select';
    import { colorPaletteName } from "../state";

    let options = true;
    
    let items = ["cool", "spring", "summer", "autumn", "winter", "greys", "viridis", "inferno", "magma"];
    
    let value = {
        value: $colorPaletteName,
        label: $colorPaletteName
    };

    $: $colorPaletteName = value.label;
</script>

<button on:click={() => options=!options}><ThreeDots/></button>



<!-- label={"Hola"} -->
{#if options}
    <!-- <h3>Paleta de colores</h3> -->
    <div class="container">
        <div class="grid grid-cols-2">
            <div class="mx-1">
                <label for="select-color-palette">Paleta de colores</label>
                <Select --list-z-index=10000 {items} inputAttributes={{ id: 'select-color-palette' }}  bind:value />
            </div>
            <div class="mx-1">
                <label for="select-max-classes">Número máximo de colores</label><br>
                <input id="select-max-classes" type="number" value="5" />
            </div>
        </div>
    </div>
{/if}

<style>
/* source: https://github.com/rob-balfre/svelte-select/blob/master/src/lib/Select.svelte */
#select-max-classes {
    border: 1px solid #d8dbdf;
    border-radius: 6px;
    min-height: 42px;
    position: relative;
    display: flex;
    align-items: stretch;
    padding: 0 0 0 16px;
    width: 100%;
    font-size: 16px;
}
        
</style>