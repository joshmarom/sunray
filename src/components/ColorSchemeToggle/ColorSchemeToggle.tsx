import { ActionIcon, Group, useMantineColorScheme } from '@mantine/core';
import { CgDarkMode } from 'react-icons/cg';
import * as React from 'react';

export function ColorSchemeToggle() {
    const { toggleColorScheme } = useMantineColorScheme();

    return (
        <Group gap="xs">
            <ActionIcon size="lg" radius="xl" variant="light" color="default" onClick={toggleColorScheme}>
                <CgDarkMode size={24} />
            </ActionIcon>
        </Group>
    );
}
