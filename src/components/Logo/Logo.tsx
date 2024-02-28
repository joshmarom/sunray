import { Group, Title } from '@mantine/core';
import * as React from 'react';
import classes from './Logo.module.css';
import { Icon } from '../../icons';

export const Logo = () => (
    <Group align="center" gap="xs">
        <Icon name="Sunny" size="sm" />
        <Title className={classes.logo}>sunray</Title>
    </Group>
);
