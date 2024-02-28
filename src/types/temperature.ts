const colors = {
    violet: 'violet',
    indigo: 'indigo',
    blue: 'blue',
    cyan: 'cyan',
    teal: 'teal',
    green: 'green',
    lime: 'lime',
    yellow: 'yellow',
    orange: 'orange',
    red: 'red',
} as const;

export type TempColor = typeof colors[keyof typeof colors];

export const tempToColor = (temp: number): TempColor => {
    const min = -10;
    const max = 40;
    const range = max - min;

    const colorRange = Object.values(colors);
    const colorStep = range / colorRange.length;
    const colorIndex = Math.floor((temp - min) / colorStep);

    return colorRange[colorIndex];
};
