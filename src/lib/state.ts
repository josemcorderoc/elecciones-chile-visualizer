import { writable, derived, readable } from 'svelte/store';
import colormap from 'colormap';
import { candidatosApiUrl, partidosApiUrl } from './constants';
import type { Comuna, ElectionOutcome } from './types';
import type { FeatureCollection } from 'geojson';
export const loadingComunasGeoJSON = writable<boolean>(false);
export const comunasFeatures = readable(<FeatureCollection>{
    type: "FeatureCollection",
    features: [],
}, function start(set){
    fetch("https://elecciones-chile-visualizer-1.s3.sa-east-1.amazonaws.com/data/comunas.json.gz")
    .then(res => res.json())
    .then(res => set(res));
})
export const comunas = derived(
    [comunasFeatures],
    ([$a]) => ($a.features.map(c => ({
            nombre: c.properties.nombre,
            distrito: c.properties.distrito,
            region: c.properties.region
        } as Comuna)))
);

export const loadingQuery = writable<boolean>(false);
export const selectedElectionNames = writable<string[]>([]);
export const selectedEntityNames = writable<string[]>([]);
export const selectedComunaNames = writable<string[]>([]);
export const percentageResults = writable<boolean>(false);

export const candidateTypeResults = writable<boolean>(false);

export const selectedApiUrl = derived(
    [candidateTypeResults],
    ([$a]) => $a ? candidatosApiUrl : partidosApiUrl 
)

export const loadingShowInUI = derived(
    [selectedElectionNames, selectedComunaNames, loadingComunasGeoJSON, loadingQuery],
    ([$a, $b, $c, $d]) => {
        if ($a.length == 0) return false;
        if ($b.length == 0) return $c;
        return $d;
    },
    false
)
export const electionOutcomesElectionComunaTotal = derived<any, ElectionOutcome[]>(
    [selectedElectionNames, selectedComunaNames, selectedApiUrl],
    ([$a, $b, $c], set) => {
        getElectionOutcomes($a, $b, [""], $c).then(outcomes => set(outcomes));
    },
    []
)
export const candidateNamesAutocomplete = derived(
    [electionOutcomesElectionComunaTotal],
    ([$outcomes]) => [...new Set($outcomes.map(outcome => outcome.EntityName))],
    []
);

export const selectedElectionOutcomes = derived(
    [electionOutcomesElectionComunaTotal, selectedEntityNames],
    ([$a, $b]) => $a.filter(outcome => $b.includes(outcome.EntityName)),
    []
);

export const colorPaletteName = writable("viridis");

export const colorPalette = derived(
    colorPaletteName, $cp => colormap({colormap: $cp, nshades: 101})
);

async function getElectionOutcomes(
    selectedElections: string[],
    selectedComunas: string[],
    selectedCandidates: string[],
    selectedApiUrl: string
): Promise<ElectionOutcome[]> {
    if ([selectedElections, selectedComunas, selectedCandidates].some(value => value.length == 0)) {
        return []
    }

    const queryParams = new URLSearchParams({
        eleccion_names: selectedElections.join(","),
        candidato_names: selectedCandidates.join(","),
        comuna_names: selectedComunas.join(",")
      });

    loadingQuery.set(true)

    const queryUrl = `${selectedApiUrl}?${queryParams.toString()}`
    const response = await fetch(queryUrl)
        .then((res) => {
            loadingQuery.set(false)
            if (!res.ok) {
            throw new Error(`There was an error ${res.status} in the request: ${res.statusText}`);
            }
            return res.json();
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    return response.results
}