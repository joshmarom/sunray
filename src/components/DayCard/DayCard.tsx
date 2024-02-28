import * as React from 'react';
import {
  Box, Paper, SimpleGrid, Stack, Title, useMantineColorScheme,
} from '@mantine/core';
import type { MantineTheme, PaperProps } from '@mantine/core';
import { pipe } from 'fp-ts/function';
import { ForecastDay } from '../../types';
import { Icon } from '../../icons';
import { TempBadge } from '../TempBadge';
// @ts-ignore
import classes from './DayCard.module.css';
import { tempToColor } from '../../types/temperature';

interface Props extends PaperProps {
  forecast: ForecastDay;
}

const dateData = (date: string | Date) => {
  const dateObj = new Date(date);

  return {
    day: dateObj.getDate(),
    month: dateObj.toLocaleString('default', { month: 'short' }),
    weekday: dateObj.toLocaleString('default', { weekday: 'short' }),
  };
};

export const DayCard = React.forwardRef<HTMLDivElement, Props>(
  ({ forecast, ...props }: Props, ref) => {
    const { date, day } = forecast;
    const { weekday, day: dayOfMonth, month } = dateData(date);
    const { maxtemp_c, mintemp_c, condition } = day;
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme !== 'dark';
    const colorLevel = isDark ? 9 : 2;
    const colorMin = pipe(mintemp_c, Number, tempToColor) || 'blue';
    const colorMax = pipe(maxtemp_c, Number, tempToColor) || colorMin;

    const Today = React.useCallback<() => React.ReactNode>(() => (date === new Date().toISOString().split('T')[0]
      ? <Title ta="center" size="h6">Today</Title>
      : null), [date]);

    const style = React.useCallback(({ colors, radius }: MantineTheme) => ({
      backgroundImage: `linear-gradient(to right, ${colors[colorMin][colorLevel]}, ${colors[colorMax][colorLevel]})`,
      borderRadius: radius.md,
    }), [colorMin, colorMax]);

    return (
      <Paper {...props} ref={ref}>
        <Stack
          gap="sm"
          mt={-60}
          align="center"
          className={classes.content}
        >
          <Icon className={classes.icon} name={condition.text} />
          <SimpleGrid className={classes.temp} cols={2} p="4" spacing="4" style={style}>
            <TempBadge value={mintemp_c} isDark={colorScheme === 'dark'} />
            <TempBadge value={maxtemp_c} isDark={colorScheme === 'dark'} />
          </SimpleGrid>
          <Box>
            <Title ta="center" fw="100" size="h1">{weekday}</Title>
            <Today />
            <Title ta="center" size="h6">
              {dayOfMonth}
              {' '}
              {month}
            </Title>
          </Box>
        </Stack>
      </Paper>
    );
  },
);
