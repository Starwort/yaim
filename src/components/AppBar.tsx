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
import {AppBar as TopAppBar, IconButton, SvgIcon, Toolbar, Typography} from '@material-ui/core';
import {Close, Maximize, Minimize} from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import isElectron from 'is-electron';
import React from 'react';
import {ReactComponent as unmaximiseIcon} from '../assets/extra_icons/unmaximise.svg';

function Unmaximise() {
    return <SvgIcon component={unmaximiseIcon} />;
}

const {ipcRenderer} = isElectron() ? window.require('electron') : {ipcRenderer: undefined};

interface AppBarProps {
    setDrawerOpen: (value: boolean) => void;
    drawerOpen: boolean;
    title: string;
}

export function AppBar({setDrawerOpen, drawerOpen, title}: AppBarProps) {
    const [maximised, setMaximised] = React.useState(true);
    if (isElectron()) {
        ipcRenderer.on('maximise', () => setMaximised(true));
        ipcRenderer.on('unmaximise', () => setMaximised(false));
    }
    return (
        <>
            <TopAppBar position="fixed" className="drag">
                <Toolbar>
                    <IconButton
                        className="no-drag"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        style={{marginRight: 16}}
                        onClick={() => setDrawerOpen(!drawerOpen)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">
                        {title}
                    </Typography>
                    <div style={{flexGrow: 1}} />
                    {isElectron() && <>
                        <IconButton
                            className="no-drag"
                            edge="end"
                            color="inherit"
                            aria-label="minimise"
                            onClick={() => ipcRenderer.send('minimise')}
                        >
                            <Minimize />
                        </IconButton>
                        {maximised ?
                            <IconButton
                                className="no-drag"
                                edge="end"
                                color="inherit"
                                aria-label="unmaximise"
                                onClick={() => {setMaximised(false); ipcRenderer.send('unmaximise');}}
                            >
                                <Unmaximise />
                            </IconButton>
                            : <IconButton
                                className="no-drag"
                                edge="end"
                                color="inherit"
                                aria-label="maximise"
                                onClick={() => {setMaximised(true); ipcRenderer.send('maximise');}}
                            >
                                <Maximize />
                            </IconButton>
                        }
                        <IconButton
                            className="no-drag"
                            edge="end"
                            color="inherit"
                            aria-label="close"
                            onClick={() => ipcRenderer.send('close')}
                        >
                            <Close />
                        </IconButton>
                    </>}
                </Toolbar>
            </TopAppBar>
            <Toolbar />
        </>
    );
}
