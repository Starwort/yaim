import {AppBar as TopAppBar, IconButton, SvgIcon, Toolbar, Typography} from '@material-ui/core';
import {Close, Maximize, Minimize} from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import {ReactComponent as unmaximiseIcon} from '../assets/extra_icons/unmaximise.svg';

function Unmaximise() {
    return <SvgIcon component={unmaximiseIcon} />;
}

const {ipcRenderer} = window.require('electron');

interface AppBarProps {
    setDrawerOpen: (value: boolean) => void;
    drawerOpen: boolean;
    title: React.ReactNode;
}

export function AppBar({setDrawerOpen, drawerOpen, title}: AppBarProps) {
    const [maximised, setMaximised] = React.useState(true);
    ipcRenderer.on('maximise', () => setMaximised(true));
    ipcRenderer.on('unmaximise', () => setMaximised(false));
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
                </Toolbar>
            </TopAppBar>
            <Toolbar />
        </>
    );
}
