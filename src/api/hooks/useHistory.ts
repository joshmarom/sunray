import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { pipe } from 'fp-ts/function';
import * as A from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import weatherApi from '../weatherApi';
import { getApiKey } from '../../config';
import { ForecastDay, WithForecast } from '../../types';

interface HistoricalWeatherQueryKey {
  date: string;
  location: string;
}

type QueryKey = [string, HistoricalWeatherQueryKey];

interface QueryProps {
  queryKey: QueryKey;
}

const parseUrl = ([, { date, location }]: QueryKey) => `/history.json?key=${getApiKey()}&q=${location}&dt=${date}`;

const getLast7Days = () => Array.from({ length: 7 }, (_, index) => {
  const currentDate = new Date();
  const date = new Date(currentDate);
  date.setDate(date.getDate() - index);
  return date.toISOString().split('T')[0];
});

const queryFn = async ({ queryKey }: QueryProps): Promise<WithForecast> => pipe(
  queryKey,
  parseUrl,
        weatherApi.get<WithForecast>,
        async (response) => {
          const { data } = await response;
          return data;
        },
);

export const useHistoryQuery = (
  props: HistoricalWeatherQueryKey,
): UseQueryResult<ForecastDay | null> => useQuery({
  queryKey: ['historicalWeather', props],
  queryFn,
  staleTime: 1000 * 3600,
  select: (data) => pipe(
    data.forecast.forecastday,
    A.head,
    O.toNullable,
  ),
});

export const useHistory = (location: string) => {
  const dateToQuery = (date: string) => useHistoryQuery({ location, date });

  return pipe(
    getLast7Days(),
    A.map(dateToQuery),
    A.reverse,
  );
};
