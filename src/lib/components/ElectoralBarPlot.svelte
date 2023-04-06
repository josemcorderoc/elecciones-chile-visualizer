<script lang="ts">
    import Plotly from "plotly.js-dist";
    import type { ElectionOutcome } from "../types";

    export let data: ElectionOutcome[];
    export let percentageResults = false;


    function getTraces(plotData: ElectionOutcome[], percentageResults) {
        let electionNames = [...new Set(plotData.map((d) => d.ElectionName))];
        return electionNames.map(function(electionName) {
            const electionData = plotData.filter(outcome => outcome.ElectionName == electionName)
            return {
                x: electionData.map((d) => d.ComunaName),
                y: electionData.map((d) => percentageResults ? d.PercVotes : d.Votes),
                name: electionName,
                type: "bar"
            }
        });
    }

    function getLayout(percentageResults: boolean) {
        let yAxisName = "Votos"
        if (percentageResults) {
            yAxisName += " (% comuna)"    
        }
        return {
            // title: "Election Results",
            xaxis: {
                title: "Comuna",
                tickangle: 45,
            },
            yaxis: {
                title: yAxisName,
            },
            autosize: true,
            showlegend: true,
            legend: {"orientation":"v", "xanchor":"center", "x":0.9, "y":1.1}
        };
    }
    const config = {
        toImageButtonOptions: {
            format: 'png', // one of png, svg, jpeg, webp
            filename: 'custom_image',
            height: 500,
            width: 800,
            scale: 2 // Multiply title/legend/axis/canvas sizes by this factor
        },
        responsive: true

    };
    function mount(node: HTMLElement, [plotData, percentageResults]: [ElectionOutcome[], boolean]) {
        Plotly.newPlot("plot", getTraces(plotData, percentageResults), getLayout(percentageResults), config);
        return {
            update([plotData, percentageResults]: [ElectionOutcome[], boolean]) {
                Plotly.react("plot", getTraces(plotData, percentageResults), getLayout(percentageResults), config);
            },
            destroy() {},
        }; 
    }
</script>

<div id="plot" use:mount={[data.sort((a,b) => percentageResults ? b.PercVotes - a.PercVotes : b.Votes - a.Votes), percentageResults]} />
