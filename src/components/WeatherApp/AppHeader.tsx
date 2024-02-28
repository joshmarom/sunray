import { AppShell, Burger, Group } from '@mantine/core';
import * as React from 'react';
// @ts-ignore
import classes from './WeatherApp.module.css';
import { Logo } from '@/components/Logo';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';

interface AppHeaderProps {
  isNavOpen: boolean;
  onNavToggle: () => void;
}

export function AppHeader({ isNavOpen, onNavToggle }: AppHeaderProps) {
  return (
    <AppShell.Header className={classes.header}>
      <Group justify="space-between" p="md">
        <Burger opened={isNavOpen} onClick={onNavToggle} hiddenFrom="sm" size="sm" />
        <Logo />
        <ColorSchemeToggle />
      </Group>
    </AppShell.Header>
  )
}
