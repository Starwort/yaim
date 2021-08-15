/* Copyright (c) 2021 Starwort
 *
 * This copyright notice may not be removed from this source code file as
 * all rights are reserved by the original author.
 *
 * This file is part of YAIM.
 *
 * YAIM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * YAIM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with YAIM. If not, see <https://www.gnu.org/licenses/>.
 */
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
