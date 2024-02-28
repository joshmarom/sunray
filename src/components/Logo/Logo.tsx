import { Group, Title } from '@mantine/core';
import * as React from 'react';
// @ts-ignore
import classes from './Logo.module.css';
import { Icon } from '../../icons';

export function Logo() {
  return (
    <Group align="center" gap="xs">
      <Icon name="Sunny" size="sm" />
      <Title className={classes.logo}>sunray</Title>
    </Group>
  )
}
