import * as React from 'react';
import { Alert, Text } from '@mantine/core';
import { AlertProps } from '@mantine/core/lib/components/Alert/Alert';
import { pipe } from 'fp-ts/function';
import { tempToColor } from '@/types/temperature';

export interface Props extends AlertProps {
  value: string | number;
  isDark?: boolean;
}

export function TempBadge({ value, isDark = false, ...badgeProps }: Props) {
  const color = pipe(value, Number, tempToColor);
  const level = isDark ? '4' : '9';

  return (
    <Alert
      variant="light"
      {...badgeProps}
      bg={`${color}.${level}`}
      radius="md"
      style={{
        padding: 4,
        boxShadow: isDark
          ? '0 0 5px 3px rgba(0, 0, 0, 0.3)'
          : '0 0 5px 3px rgba(255, 255, 255, 0.2)',
      }}
    >
      <Text fw="bold" ta="center" size="sm" c={`${isDark ? 'dark' : 'white'}`} lh={1}>
        {value}
        °
      </Text>
    </Alert>
  );
}
