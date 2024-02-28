import {
  AppShell, Button, Group, Select, Stack, Title,
} from '@mantine/core'
import * as React from 'react';
import { VscGithubInverted } from 'react-icons/vsc';
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
      <Stack m={{ sm: 'xs', md: 'sm' }} h="100%" justify="space-between">
        <Stack gap="md">
          <Title size="h5" c="natural">Pick a Location</Title>
          <Select
            data={countries}
            searchable
            placeholder="Select Country"
            value={country}
            onChange={handleSelectCountry}
            disabled={!locationsLoaded}
          />
          {!country
            ? null
            : (
              <Select
                data={cities}
                searchable
                placeholder="Select City"
                value={city}
                onChange={handleSelectCity}
                disabled={!country}
              />
            )}
        </Stack>
        <Group gap="md" align="center" c="gray">
          <Button
            leftSection={<VscGithubInverted size={24} />}
            component="a"
            href="https://github.com/joshmarom/sunray"
            target="_blank"
            variant="light"
            size="sm"
            radius="xl"
            fullWidth
          >
            Get the code
          </Button>
        </Group>
      </Stack>
    </AppShell.Navbar>
  );
}
