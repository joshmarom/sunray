import SVG from 'react-inlinesvg';
import * as React from 'react';
import { Props } from 'react-inlinesvg/src/types';
import { Center, Tooltip } from '@mantine/core';
import { ConditionText, WeatherIcon } from '@/types';

export const conditionIcons = {
  Sunny: 'clear-day',
  Clear: 'clear-night',
  'Partly cloudy': 'partly-cloudy-day',
  Cloudy: 'cloudy',
  Overcast: 'overcast',
  Mist: 'fog',
  'Patchy rain possible': 'partly-cloudy-day-rain',
  'Patchy snow nearby': 'partly-cloudy-day-snow',
  'Patchy sleet nearby': 'sleet',
  'Patchy freezing drizzle nearby': 'partly-cloudy-day-sleet',
  'Thundery outbreaks in nearby': 'thunderstorms',
  'Blowing snow': 'wind-snow',
  Blizzard: 'extreme-snow',
  Fog: 'fog',
  'Freezing fog': 'extreme-fog',
  'Patchy light drizzle': 'drizzle',
  'Light drizzle': 'drizzle',
  'Freezing drizzle': 'extreme-drizzle',
  'Heavy freezing drizzle': 'extreme-drizzle',
  'Patchy light rain': 'partly-cloudy-day-rain',
  'Light rain': 'drizzle',
  'Moderate rain at times': 'rain',
  'Moderate rain': 'rain',
  'Heavy rain at times': 'rain',
  'Heavy rain': 'rain',
  'Patchy rain nearby': 'partly-cloudy-day-rain',
  'Light freezing rain': 'partly-cloudy-day-sleet',
  'Moderate or heavy freezing rain': 'rain',
  'Light sleet': 'sleet',
  'Moderate or heavy sleet': 'sleet',
  'Patchy light snow': 'snow',
  'Light snow': 'snow',
  'Patchy moderate snow': 'snow',
  'Moderate snow': 'snow',
  'Patchy heavy snow': 'snow',
  'Heavy snow': 'snow',
  'Ice pellets': 'sleet',
  'Light rain shower': 'rain',
  'Moderate or heavy rain shower': 'rain',
  'Torrential rain shower': 'rain',
  'Light sleet showers': 'sleet',
  'Moderate or heavy sleet showers': 'sleet',
  'Light snow showers': 'snow',
  'Moderate or heavy snow showers': 'snow',
  'Light showers of ice pellets': 'sleet',
  'Moderate or heavy showers of ice pellets': 'sleet',
  'Patchy light rain in area with thunder': 'thunderstorms',
  'Moderate or heavy rain with thunder': 'thunderstorms-extreme-rain',
  'Moderate or heavy rain in area with thunder': 'thunderstorms-extreme-rain',
  'Patchy light snow in area with thunder': 'thunderstorms',
  'Moderate or heavy snow in area with thunder': 'thunderstorms',
  'wind-beaufort-12': 'wind-beaufort-12',
  'wind-beaufort-11': 'wind-beaufort-11',
  'wind-beaufort-10': 'wind-beaufort-10',
  'wind-beaufort-9': 'wind-beaufort-9',
  'wind-beaufort-8': 'wind-beaufort-8',
  'wind-beaufort-7': 'wind-beaufort-7',
  'wind-beaufort-6': 'wind-beaufort-6',
  'wind-beaufort-5': 'wind-beaufort-5',
  'wind-beaufort-4': 'wind-beaufort-4',
  'wind-beaufort-3': 'wind-beaufort-3',
  'wind-beaufort-2': 'wind-beaufort-2',
  'wind-beaufort-1': 'wind-beaufort-1',
  Wind: 'wind',
  Temperature: 'thermometer',
  Humidity: 'humidity',
} as const satisfies { [key in ConditionText]: WeatherIcon };

const iconSize = {
  xs: 16,
  sm: 32,
  md: 48,
  lg: 72,
  xl: 96,
  '2xl': 128,
  '3xl': 192,
} as const;

export type IconSize = keyof typeof iconSize;

interface IconProps extends Omit<Props, 'src'> {
  name: ConditionText
  size?: IconSize
}

const BASE_URL = '/icons';

const getFileName = (name: ConditionText) => {
  const iconName = Object.entries(conditionIcons).find(([key]) => key.trim().toLowerCase() === name.trim().toLowerCase())?.[1];

  return iconName ? `${iconName}.svg` : undefined;
};

const getIds = (svg: Document): ReadonlyArray<string> => [...svg.querySelectorAll('symbol[id], linearGradient[id]')].map(({ id }) => id);

const parseSVG = (svg: string) => {
  const randomPrefix = Math.random().toString(36).substring(7);
  const parser = new DOMParser();
  const xml = svg.replace('"#', `"#${randomPrefix}-`);
  const doc = parser.parseFromString(xml, 'image/svg+xml');

  getIds(doc).forEach((id) => {
    doc.getElementById(id)?.setAttribute('id', `${randomPrefix}-${id}`);
  });

  [...doc.querySelectorAll('svg *')]
    .forEach((el) => {
      const stroke = el.getAttribute('stroke');
      const href = el.getAttribute('xlink:href');
      const fill = el.getAttribute('fill');

      if (fill && fill.includes('url(') && fill.startsWith('url(#')) {
        el.setAttribute('fill', `url(#${randomPrefix}-${fill.slice(5)}`);
      }

      if (href && href.startsWith('#')) {
        el.setAttribute('xlink:href', `#${randomPrefix}-${href.slice(1)}`);
      }

      if (stroke && stroke.startsWith('url(#')) {
        el.setAttribute('stroke', `url(#${randomPrefix}-${stroke.slice(5)}`);
      }

      const colorStops = [...el.querySelectorAll('stop')];

      colorStops.forEach((stop) => {
        if (stop.getAttribute('stop-color')?.includes('-')) {
          // replace the hyphen and everything preceding it with just '#' to fix the color value
          stop.setAttribute(
            'stop-color',
            `#${stop.getAttribute('stop-color')?.split('-')[1]}`,
          );
        }
      });
    });

  return doc.documentElement.outerHTML;
};

export const importIcon = async (condition: ConditionText): Promise<string | null> => {
  const fileName = getFileName(condition);

  if (!fileName) return Promise.resolve(null);

  const options: RequestInit = {
    headers: { 'Content-Type': 'image/svg+xml' },
    cache: 'force-cache',
  };

  const response = await fetch([BASE_URL, fileName].join('/'), options);
  const xml = await response.text();

  return parseSVG(xml);
};

export function Icon({ name, ...props }: IconProps) {
  const [icon, setIcon] = React.useState<string | null>(null);
  const size = iconSize[props.size || 'xl'];

  React.useEffect(() => {
    importIcon(name).then(setIcon);
  }, [name]);

  if (icon == null) return null;

  return (
    <Tooltip
      transitionProps={{ transition: 'pop' }}
      label={name}
      offset={0}
      withArrow
    >
      <Center>
        <SVG height={size} {...props} src={icon} />
      </Center>
    </Tooltip>
  );
}
