import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from './Router';
import { theme } from './theme';

const queryClient = new QueryClient();
export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme} defaultColorScheme="dark">
                <Router />
            </MantineProvider>
        </QueryClientProvider>
    );
}
