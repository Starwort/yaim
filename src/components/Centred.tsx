import React from 'react';
import {createUseStyles} from 'react-jss';

interface CentredProps {
    children: React.ReactNode;
    verticalAlign?: 'top' | 'centre' | 'bottom';
    horizontalAlign?: 'left' | 'centre' | 'right';
}

const useStyles = createUseStyles({
    base: {
        display: 'flex',
        height: '100%',
        width: '100%',
    },
    top: {
        alignItems: 'flex-start',
    },
    vcentre: {
        alignItems: 'center',
    },
    bottom: {
        alignItems: 'flex-end',
    },
    left: {
        justifyContent: 'flex-start',
    },
    hcentre: {
        justifyContent: 'center',
    },
    right: {
        justifyContent: 'flex-end',
    },
});

export function Centred({children, verticalAlign, horizontalAlign}: CentredProps) {
    const classes = useStyles();
    const VERT_OPTIONS = {
        top: classes.top,
        centre: classes.vcentre,
        bottom: classes.bottom,
    };
    const HOR_OPTIONS = {
        left: classes.left,
        centre: classes.hcentre,
        right: classes.right,
    };
    return <div className={classes.base + ' ' + VERT_OPTIONS[verticalAlign ?? 'centre'] + ' ' + HOR_OPTIONS[horizontalAlign ?? 'centre']}>
        {children}
    </div>;
}