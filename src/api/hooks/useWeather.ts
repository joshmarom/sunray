import { useQuery } from '@tanstack/react-query';
import { getApiKey } from '../../config';
import weatherApi from '../weatherApi';
import { WeatherData } from '../../types';

export const useWeather = (location: string) =>
    useQuery<WeatherData>({
        queryKey: ['weather', location],
        queryFn: async (): Promise<WeatherData> => {
            const url = `/current.json?key=${getApiKey()}&q=${location}`;
            const res = await weatherApi.get<WeatherData>(url);

            return res.data;
        },
    });
