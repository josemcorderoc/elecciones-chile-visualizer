export type ElectionOutcome = {
    election: string,
    candidate: string,
    comuna: string,
    votes: number
}

export type Votes = number;

export type Candidates = {
    [key: string]: Votes
}

export type Comunas = {
    [key: string]: Candidates
}
  
export type Elections = {
    [key: string]: Comunas
}
