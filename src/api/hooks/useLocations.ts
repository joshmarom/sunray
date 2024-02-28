import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { constUndefined, flow, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/ReadonlyArray';
import LocationsApi from '../locationsApi';

export type Country = {
    country: string;
    cities: string[];
};

export type Countries = ReadonlyArray<Country>;

export type LocationsApiResult = {
    data: Countries;
};

export interface LocationsHook {
    data: ReadonlyArray<Country> | undefined;
    isSuccess: boolean;
    countries: ReadonlyArray<string>;
    cities: ReadonlyArray<string>;
    country: string | null;
    city: string | null;
    handleSelectCountry: (value: string | null) => void;
    handleSelectCity: (value: string | null) => void;
}

export const useLocations = (): LocationsHook => {
    const { data: locationsData, isSuccess: locationsLoaded } = useQuery({
        queryKey: ['locations'],
        queryFn: (): Promise<{ data: LocationsApiResult }> => LocationsApi.get('countries/'),
        select: ({ data }: { data: LocationsApiResult }) => data.data,
    });

    const [country, setCountry] = React.useState<string | null>(null);
    const [city, setCity] = React.useState<string | null>(null);

    const countries = React.useMemo<ReadonlyArray<string>>(() => pipe(
        locationsData,
        O.fromNullable,
        O.fold(
            A.zero<string>,
            flow(
                A.map(({ country: x }) => x),
                (x) => [...new Set(x)]
            ),
        )
    ), [locationsData]);

    const cities = React.useMemo<ReadonlyArray<string>>(() => pipe(
        locationsData,
        O.fromNullable,
        O.fold(
            A.zero<string>,
            flow(
                A.filter(({ country: x }) => x === country),
                A.map(({ cities: x }) => x),
                A.flatten,
                (x) => Array.from(new Set(x))
            ),
        )
    ), [locationsData, country]);

    const handleSelectCountry = React.useCallback<(value: string | null) => void>(
        flow(
            O.fromNullable,
            O.fold(constUndefined, (v) => {
                setCountry(v);
                setCity(null);
            })
        ), []
    );

    const handleSelectCity = React.useCallback<(value: string | null) => void>(
        flow(
            O.fromNullable,
            O.fold(constUndefined, setCity)
        ), []
    );

    return {
        data: locationsData,
        isSuccess: locationsLoaded,
        countries,
        cities,
        country,
        city,
        handleSelectCountry,
        handleSelectCity,
    };
};
