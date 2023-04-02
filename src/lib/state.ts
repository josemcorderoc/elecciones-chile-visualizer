import { writable, derived } from 'svelte/store';
import type { ElectionOutcome } from './types';
import colormap from 'colormap';
import { electionsApiUrl } from './constants';

export const selectedElectionNames = writable<string[]>([]);
export const selectedCandidateNames = writable<string[]>([]);
export const selectedComunaNames = writable<string[]>([]);
export const percentageResults = writable<boolean>(false);

export const electionOutcomesElectionComunaTotal = derived<any, ElectionOutcome[]>(
    [selectedElectionNames, selectedComunaNames],
    ([$a, $b], set) => {
        getElectionOutcomes($a, $b, [""]).then(outcomes => set(outcomes));
    },
    []
)
export const candidateNamesAutocomplete = derived(
    [electionOutcomesElectionComunaTotal],
    ([$outcomes]) => [...new Set($outcomes.map(outcome => outcome.CandidateName))],
    []
);

export const selectedElectionOutcomes = derived(
    [electionOutcomesElectionComunaTotal, selectedCandidateNames],
    ([$a, $b]) => $a.filter(outcome => $b.includes(outcome.CandidateName)),
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
): Promise<ElectionOutcome[]> {
    if ([selectedElections, selectedComunas, selectedCandidates].some(value => value.length == 0)) {
        return []
    }

    const queryParams = new URLSearchParams({
        eleccion_name: selectedElections[0],
        candidato_name: selectedCandidates[0]
      });

    selectedComunas.forEach(
        comuna => queryParams.append("comuna_names", comuna)
    )
    console.log(selectedElections)
    console.log(selectedComunas)
    console.log(selectedCandidates)
    console.log("API HIT")
    const response = await fetch(`${electionsApiUrl}/votes?${queryParams.toString()}`)
    .then((response) => {
        if (!response.ok) {
          throw new Error('There was an error in the request');
        }
        return response.json();
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    return response.results
}