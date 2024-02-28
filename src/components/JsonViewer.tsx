import {
    JsonView,
    collapseAllNested,
    darkStyles,
    defaultStyles,
    Props as JsonViewerProps,
} from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import * as React from 'react';
import { useColorScheme } from '@mantine/hooks';

export const JsonViewer = (props: JsonViewerProps = {
    data: {},
    shouldExpandNode: collapseAllNested,
}) => {
    const colorScheme = useColorScheme();
    const style = colorScheme === 'dark' ? darkStyles : defaultStyles;

    return <JsonView style={style} {...props} />;
};
