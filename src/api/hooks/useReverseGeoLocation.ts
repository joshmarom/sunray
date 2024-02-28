import ReverseGeocode, { ILocation, IGeocode } from 'bigdatacloud-reverse-geocoding';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useReverseGeoLocation = (location: ILocation = {
  lat: 0,
  long: 0,
}):
UseQueryResult<IGeocode> => useQuery({
  queryKey: ['reverseGeoLocation'],
  queryFn: async () => {
    const geocode = new ReverseGeocode();

    return geocode.locate(location);
  },
  staleTime: 1000 * 3600,
});
