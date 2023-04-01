export type ElectionOutcome = {
    election: string,
    candidate: string,
    comuna: string,
    votes: number
}

export type Votes = {
    "%": number,
    "votos": number
};

export type Candidates = {
    [key: string]: Votes
}

export type Comunas = {
    [key: string]: Candidates
}
  
export type Elections = {
    [key: string]: Comunas
}

export type ColorClass = {
    min: number,
    max: number,
    color: string
}

export type Comuna = {
    nombre: string,
    distrito: string,
    region: string   
}
