import { useQuery } from '@tanstack/react-query'
import { pipe } from 'fp-ts/function'
import { getApiKey } from '@/config';
import weatherApi from '@/api/weatherApi';
import { WeatherData } from '@/types';

export const useWeather = (location: string) => useQuery({
  queryKey: ['weather', location],
  queryFn: () => pipe(
    `/current.json?key=${getApiKey()}&q=${location}`,
    weatherApi.get<WeatherData>,
  ),
  select: ({ data }) => data.current,
  staleTime: 1000 * 3600,
});
