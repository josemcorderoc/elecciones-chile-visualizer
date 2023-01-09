import { writable, derived } from 'svelte/store';
import type { ElectionOutcome, Elections } from './types';
import colormap from 'colormap';

export const selectedElectionNames = writable<string[]>([]);
export const selectedCandidateNames = writable<string[]>([]);
export const selectedComunaNames = writable<string[]>([]);
export const percentageResults = writable<boolean>(false);

export const elections = writable<Elections>({});

export const resultsType = derived(
    percentageResults, $p => $p ? "%" : "votos"
)

export const candidateNamesAutocomplete = derived(
    [selectedElectionNames, selectedComunaNames, elections],
    ([$a, $b, $c]) => getCandidateNames($a, $b, $c)
);

export const selectedElectionOutcomes = derived(
    [selectedElectionNames, selectedComunaNames, selectedCandidateNames, resultsType, elections],
    ([$a, $b, $c, $d, $e]) => getElectionOutcomes($a, $b, $c, $d, $e)
);

export const colorPaletteName = writable("viridis");

export const colorPalette = derived(
    colorPaletteName, $cp => colormap({colormap: $cp, nshades: 101})
);

export function getCandidateNames(
    selectedElectionNames: string[],
    selectedComunaNames: string[],
    elections: Elections
): string[] {
    const candidateNames = Object.entries(elections)
        .filter(([electionName, _]) =>
            selectedElectionNames.includes(electionName)
        )
        .map(([_, comunas]) => Object.entries(comunas))
        .flat()
        .filter(([comunaName, _]) =>
            selectedComunaNames.includes(comunaName)
        )
        .map(([_, candidates]) => Object.keys(candidates))
        .flat();
    return [...new Set(candidateNames)];
}

function getElectionOutcomes(
    selectedElections: string[],
    selectedComunas: string[],
    selectedCandidates: string[],
    resultsType: string,
    elections: Elections
): ElectionOutcome[] {
    const outcomes = [];
    for (const electionName of selectedElections) {
        for (const comunaName of selectedComunas) {
            for (const candidateName of selectedCandidates) {
                if (((electionName in elections)) && ((comunaName in elections[electionName]))
                    && ((candidateName in elections[electionName][comunaName]))) {
                    let votes = elections[electionName][comunaName][candidateName][resultsType];
                    outcomes.push({
                        election: electionName,
                        comuna: comunaName,
                        candidate: candidateName,
                        votes: votes
                    });
                }
            }
        }
    }
    return outcomes;
}