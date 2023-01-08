export function formatVotes(votes: number, percentageResults: boolean, withSuffix: boolean = false) {
    const formattedVotes = percentageResults
        ? (votes * 100).toLocaleString("es-CL")
        : votes.toLocaleString("es-CL");
    const suffix = withSuffix ? (percentageResults ? "%" : " votos") : "";
    return formattedVotes + suffix;
}