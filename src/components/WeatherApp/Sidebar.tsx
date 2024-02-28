import {
  AppShell, Select, Stack, Title,
} from '@mantine/core';
import * as React from 'react';
// @ts-ignore
import classes from './WeatherApp.module.css';
import { LocationsHook } from '@/api/hooks/useLocations';

export function AppSidebar({
  country,
  city,
  countries,
  cities,
  handleSelectCountry,
  handleSelectCity,
  isSuccess: locationsLoaded,
}: LocationsHook) {
  return (
    <AppShell.Navbar className={classes.sidebar}>
      <Stack gap="md" m={{ xs: 'md', md: 'lg' }}>
        <Title size="h5" c="natural">Pick a Location</Title>
        <Select
          data={countries}
          searchable
          placeholder="Select Country"
          value={country}
          onChange={handleSelectCountry}
          disabled={!locationsLoaded}
        />
        <Select
          data={cities}
          searchable
          placeholder="Select City"
          value={city}
          onChange={handleSelectCity}
          disabled={!country}
        />
      </Stack>
    </AppShell.Navbar>
  );
}
