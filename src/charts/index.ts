import * as React from 'react';
import { Props as LineChartProps } from '../components/LineChart/Chart';
import { CurrentWeather, ForecastDay } from '../types';

export const useForecastChartData = (data: ReadonlyArray<ForecastDay>) => React.useMemo<LineChartProps['data']>(() => ({
    labels: data.map(({ date }) => date),
    datasets: [
        {
            data: data.map(({ day }) => day.avgtemp_c),
            borderColor: 'rgb(132, 99, 255)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            yAxisID: 'y',
        },
    ],
}), [data]);

export const useChartData = (data: ReadonlyArray<CurrentWeather>) => React.useMemo<LineChartProps['data']>(() => ({
    labels: data.map((w) => {
        const date = new Date(w.time);
        const hours = date.getHours();
        const ampm = hours >= 12 ? 'pm' : 'am';

        return `${hours}:00 ${ampm}`;
    }),
    datasets: [
        {
            label: 'Temperature',
            data: data.map((w) => (w.feelslike_c + w.temp_c) / 2),
            borderColor: 'rgb(132, 99, 255)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            yAxisID: 'y',
        },
        {
            label: 'Rainfall',
            data: data.map((w) => w.precip_mm),
            borderColor: 'rgb(20, 99, 255)',
            yAxisID: 'y2',

        },
        {
            label: 'Clouds',
            data: data.map((w) => w.cloud),
            borderColor: 'rgba(60, 160, 200, 0.2)',
            yAxisID: 'y3',
            borderWidth: 6,
        },
    ],
}), [data]);
