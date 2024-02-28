import {
  AspectRatio, Center, Paper, SimpleGrid, Stack, Text, Title,
} from '@mantine/core';
import * as React from 'react';
import { Icon } from '@/icons';
import { ConditionText, CurrentWeather } from '@/types';

interface QuadItem {
  icon: ConditionText;
  label: string | number;
}

const useConditionsQuadrant = (current: CurrentWeather) => {
  const condition = React.useMemo<QuadItem>(() => ({
    icon: current.condition.text as ConditionText,
    label: current.condition.text,
  }), [current.condition.text]);

  const temperature = React.useMemo<QuadItem>(() => ({
    icon: 'Temperature',
    label: `${current.temp_c}°`,
  }), [current.temp_c]);

  const wind = React.useMemo<QuadItem>(() => ({
    icon: 'Wind',
    label: current.wind_kph,
  }), [current.wind_kph]);

  const humidity = React.useMemo<QuadItem>(() => ({
    icon: 'Humidity',
    label: current.humidity,
  }), [current.condition.text]);

  return React.useMemo<ReadonlyArray<QuadItem>>(
    () => [condition, temperature, wind, humidity] as const,
    [condition, temperature, wind, humidity],
  )
}

export const ConditionsQuadrant = React.memo(({ current }: { current: CurrentWeather }) => {
  const icons = useConditionsQuadrant(current)

  return (
    <>
      <Title ta="center" size="h5" mt="md" c="gray">Current conditions:</Title>
      <SimpleGrid cols={2} spacing="md" mt="xl" maw="400px" mx="auto">
        {icons.map(({ icon, label }) => (
          <Paper
            key={icon + label}
            p="md"
            radius="md"
            ratio={1}
            component={AspectRatio}
            withBorder
          >
            <Center>
              <Stack ta="center">
                <Icon name={icon} size="lg" />
                <Text fz={{ md: 'sm', lg: 'lg' }}>
                  {label}
                </Text>
              </Stack>
            </Center>
          </Paper>
        ))}
      </SimpleGrid>
    </>
  )
})
