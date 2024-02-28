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

export function ConditionsQuadrant({ current }: { current: CurrentWeather }) {
  const icons: ReadonlyArray<QuadItem> = [
    {
      icon: current.condition.text as ConditionText,
      label: current.condition.text,
    },
    {
      icon: 'Temperature',
      label: `${current.temp_c}°`,
    },
    {
      icon: 'Wind',
      label: current.wind_kph,
    },
    {
      icon: 'Humidity',
      label: current.humidity,
    },
  ] as const;

  return (
    <>
      <Title size="h3" mb="lg">Current conditions</Title>
      <SimpleGrid cols={2} spacing="md">
        {icons.map(({ icon, label }) => (
          <Paper key={icon + label} p="md" radius="md" ratio={1} component={AspectRatio}>
            <Center>
              <Stack ta="center">
                <Icon name={icon} size="lg" />
                <Text fz={{ md: 'sm', lg: 'lg' }}>{label}</Text>
              </Stack>
            </Center>
          </Paper>
        ))}
      </SimpleGrid>
    </>
  )
}
