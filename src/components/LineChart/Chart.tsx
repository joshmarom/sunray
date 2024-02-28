import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { ChartProps, Line } from 'react-chartjs-2';

export type Props = Omit<ChartProps<'line', ReadonlyArray<number>>, 'type'>;

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
    stacked: false,
    scales: {
        y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            max: 40,
            min: -10,
        },
        y2: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            max: 3,
            min: 0,
            grid: {
                drawOnChartArea: false,
            },
        },
        y3: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            max: 100,
            min: 0,
            grid: {
                drawOnChartArea: false,
            },
        },
    },
    cubicInterpolationMode: 'monotone',
} as const as Props['options'];

export const Chart = (props: Props) => <Line options={options} {...props} />;
