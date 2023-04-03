export type ElectionOutcome = {
    ElectionName: string,
    EntityName: string,
    ComunaName: string,
    Votes: number,
    PercVotes: number
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
