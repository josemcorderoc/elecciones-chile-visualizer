import { writable, derived } from 'svelte/store';
import colormap from 'colormap';
import { candidatosApiUrl, partidosApiUrl } from './constants';
import type { ElectionOutcome } from './types';
export const loadingComunasGeoJSON = writable<boolean>(false);
export const loadingQuery = writable<boolean>(false);
export const selectedElectionNames = writable<string[]>([]);
export const selectedCandidateNames = writable<string[]>([]);
export const selectedComunaNames = writable<string[]>([]);
export const percentageResults = writable<boolean>(false);

export const partyTypeResults = writable<boolean>(false);

export const selectedApiUrl = derived(
    [partyTypeResults],
    ([$a]) => $a ? partidosApiUrl : candidatosApiUrl 
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
    [electionOutcomesElectionComunaTotal, selectedCandidateNames],
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
        eleccion_name: selectedElections[0],
        candidato_name: selectedCandidates[0],
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