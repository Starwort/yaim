import {useMediaQuery, useTheme} from '@material-ui/core';
import React from 'react';

interface DrawerAdjustProps {
    active: boolean;
    children: React.ReactNode;
}
export function DrawerAdjust(props: DrawerAdjustProps) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    return (
        <div style={{paddingLeft: 240 * (+props.active) * (+matches), transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms'}}>
            {props.children}
        </div>
    );
}
