import { writable, derived } from 'svelte/store';
import { elections } from './constants';
import type { ElectionOutcome } from './types';
 
export const selectedElectionNames = writable<string[]>([]);
export const selectedCandidateNames = writable<string[]>([]);
export const selectedComunaNames = writable<string[]>([]);

export const candidateNamesAutocomplete = derived(
    [selectedElectionNames, selectedComunaNames],
    ([$a, $b]) => getCandidateNames($a, $b)
);

export const selectedElectionOutcomes = derived(
    [selectedElectionNames, selectedComunaNames, selectedCandidateNames],
    ([$a, $b, $c]) => getElectionOutcomes($a, $b, $c)
);

export function getCandidateNames(
    selectedElectionNames: string[],
    selectedComunaNames: string[]
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
    selectedCandidates: string[]
): ElectionOutcome[] {
    const outcomes = [];
    for (const electionName of selectedElections) {
        for (const comunaName of selectedComunas) {
            for (const candidateName of selectedCandidates) {
                let votes = elections[electionName][comunaName][candidateName];
                if (votes) {
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