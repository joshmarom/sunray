import * as React from 'react';
import { WeatherApp } from '@/components/WeatherApp/WeatherApp';

const DEFAULT_LOCATION = 'Tel Aviv';

export function HomePage() {
  return <WeatherApp location={DEFAULT_LOCATION} />;
}
