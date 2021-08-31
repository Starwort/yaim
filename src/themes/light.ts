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
import {createTheme} from '@material-ui/core/styles';
import '../prototype_mods';
import {commonProps} from './common_theme_data';

// Normal or default theme
const theme = createTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#6200ee',
            contrastText: 'rgba(255,255,255,87%)',
        },
        secondary: {
            main: '#03dac6',
            contrastText: 'rgba(0,0,0,87%)',
        },
        error: {
            main: '#b00020',
        },
        background: {
            paper: '#ffffff',
            default: '#eeeeee'
        },
        text: {
            primary: 'rgba(0,0,0,87%)',
            secondary: 'rgba(0,0,0,60%)',
            hint: 'rgba(0,0,0,60%)',
            disabled: 'rgba(0,0,0,38%)',
        }
    },
    zIndex: {
        appBar: 1250
    },
    props: commonProps,
});

theme.overrides = {
    MuiDrawer: {
        paper: {
            width: 240
        }
    },
    MuiCard: {
        root: {
            borderWidth: 1,
            borderColor: 'transparent',
            borderStyle: 'solid',
        },
    },
    MuiCardHeader: {
        root: {
            paddingBottom: 0,
            textAlign: 'center',
        },
    },
};

export default theme;
