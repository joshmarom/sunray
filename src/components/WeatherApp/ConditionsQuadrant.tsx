import {
  AspectRatio, Center, Paper, SimpleGrid, Stack, Text, Title,
} from '@mantine/core';
import * as React from 'react';
import { Icon } from '@/icons';
import { ConditionText, CurrentWeather } from '@/types';

export function ConditionsQuadrant({ current }: { current: CurrentWeather }) {
  return (
    <>
      <Title size="h3" mb="lg">Current conditions</Title>
      <SimpleGrid cols={2} spacing="md">
        {[
          [
            <Icon name={current.condition.text as ConditionText} />,
            <Text>{current.condition.text}</Text>,
          ],
          [
            <Icon name="Temperature" />,
            <Text>
              {current.temp_c}
              °
            </Text>,
          ],
          [
            <Icon name="Wind" />,
            <Text>
              {current.wind_kph}
              kmh
            </Text>,
          ],
          [
            <Icon name="Humidity" />,
            <Text>{current.humidity}</Text>,
          ],
        ].map((item, i) => (
          <Paper key={i} p="md" radius="md" ratio={1} component={AspectRatio}>
            <Center>
              <Stack ta="center">{item}</Stack>
            </Center>
          </Paper>
        ))}
      </SimpleGrid>
    </>
  )
}
