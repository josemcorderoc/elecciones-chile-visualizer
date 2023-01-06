import { jenks } from 'simple-statistics';
import { viridis } from './constants';
import type { ColorClass } from './types';

export function generateColorScale(values: number[], maxClasses: number = 5): ColorClass[] {
    if (values.length == 0) return [];

    const nClasses = Math.min(values.length, maxClasses);
    const classBreaks = jenks(values, nClasses);
    const maxBreak = classBreaks.at(-2);
    const breaksColors = [];

    for (let i = 0; i < nClasses; i++) {
        const perc = Math.floor(classBreaks[i]*100.0/maxBreak); 

        breaksColors.push({
            min: classBreaks[i],
            max: nClasses == values.length ? classBreaks[i] : classBreaks[i+1],
            color: viridis[perc]
        })
    }

    return breaksColors;
}

export function getColor(value: number, colorClasses: ColorClass[]): string {
    for (let i = colorClasses.length - 1; i >= 0; i--) {
        const interval = colorClasses[i];
        if (value >= interval.min && value <= interval.max) {
            return interval.color;
        }   
    }
    throw new Error(`Could not find color for value ${value}.`);
}  