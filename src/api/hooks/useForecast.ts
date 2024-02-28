import * as A from 'fp-ts/ReadonlyArray';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { getApiKey } from '@/config';
import weatherApi from '@/api/weatherApi';
import { ForecastDay, WeatherData, WithForecast } from '../../types';

interface ForecastQueryKey {
  location: string;
  days: number;
}

const parseUrl = ({ location, days }: ForecastQueryKey) => `/forecast.json?key=${getApiKey()}&q=${location}&days=${days}`;

interface QueryProps {
  queryKey: [string, ForecastQueryKey];
}

const queryFn = async ({
  queryKey: [,props],
}: QueryProps): Promise<WeatherData> => {
  const res = await pipe(
    props,
    parseUrl,
      weatherApi.get<WeatherData>,
  );

  return res.data;
};

export const useForecastData = (
  location: string,
  days: number = 10,
): UseQueryResult<WeatherData> => useQuery({
  queryKey: ['forecast', { location, days }],
  queryFn,
  staleTime: 1000 * 3600,
});

const getForecast = (data: WithForecast) => data.forecast.forecastday;

export const useForecast = (location: string): ReadonlyArray<ForecastDay> => {
  const { data, isSuccess } = useForecastData(location);

  if (!isSuccess) return A.zero<ForecastDay>();

  return pipe(
    data,
    O.fromNullable,
    O.map(getForecast),
    O.getOrElse(A.zero<ForecastDay>),
  );
};
