import { Group, ScrollArea } from '@mantine/core';
import { pipe } from 'fp-ts/function';
import * as A from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import * as React from 'react';
import { DayCard } from '@/components/DayCard/DayCard';
// @ts-ignore
import classes from './WeatherApp.module.css';
import { ForecastDay } from '@/types';
import { isToday } from '@/helpers';

interface Props {
  forecast: ReadonlyArray<ForecastDay>
}
export function DaysScrollArea({ forecast }: Props) {
  return (
    <ScrollArea
      className={classes.scrollArea}
      offsetScrollbars
      scrollbarSize="xs"
    >
      <Group gap="sm" wrap="nowrap">
        {pipe(
          forecast,
          A.filterMap(O.fromNullable),
          A.map((day) => (
            <DayCard
              className={classes.card}
              key={day.date}
              forecast={day}
              withBorder={isToday(day.date)}
            />
          )),
        )}
      </Group>
    </ScrollArea>
  )
}
