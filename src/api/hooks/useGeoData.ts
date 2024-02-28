import { useQuery, UseQueryResult } from '@tanstack/react-query';
import geoApi from '../geoApi';
import { getGeoApiKey } from '../../config';

interface Coordinates {
    lat: number | null;
    lon: number | null;
}

interface GeoQueryProps {
    queryKey: [string, Coordinates]
}

const queryFn = async ({ queryKey: [, { lat, lon }] }: GeoQueryProps) => {
    // handle null values
    if (!lat || !lon) {
        return {
            type: 'error',
            features: [],
            query: {
                lat: 0,
                lon: 0,
                plus_code: '',
            },
        };
    }
    const res = await geoApi.get(`/?lat=${lat}&lon=${lon}&apiKey=${getGeoApiKey()}`);
    return res.data;
};

interface GeoDataResult {
    type: string;
    features: {
        type: string;
        properties: {
            datasource: {
                sourcename: string;
                attribution: string;
                license: string;
                url: string;
            };
            name: string;
            country: string;
            country_code: string;
            state: string;
            city: string;
            postcode: string;
            district: string;
            suburb: string;
            street: string;
            housenumber: string;
            lon: number;
            lat: number;
            distance: number;
            result_type: string;
            formatted: string;
            address_line1: string;
            address_line2: string;
            category: string;
            timezone: {
                name: string;
                offset_STD: string;
                offset_STD_seconds: number;
                offset_DST: string;
                offset_DST_seconds: number;
                abbreviation_STD: string;
                abbreviation_DST: string;
            };
            plus_code: string;
            rank: {
                importance: number;
                popularity: number;
            };
            place_id: string;
        };
        geometry: {
            type: string;
            coordinates: [number, number];
        };
        bbox: [number, number, number, number];
    }[];
    query: {
        lat: number;
        lon: number;
        plus_code: string;
    };
}

export const useGeoData = (props: Coordinates): UseQueryResult<GeoDataResult> => useQuery({
    queryKey: ['geo', props],
    queryFn,
    staleTime: 1000 * 60 * 60 * 24,
});
