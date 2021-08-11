import {AppBar as TopAppBar, IconButton, Toolbar} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';


interface AppBarProps {
    setDrawerOpen: (value: boolean) => void;
    drawerOpen: boolean;
    title: React.ReactNode;
}

export function AppBar(props: AppBarProps) {
    return (
        <>
            <TopAppBar position="fixed">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu"
                        style={{marginRight: 16}}
                        onClick={() => props.setDrawerOpen(!props.drawerOpen)}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </TopAppBar>
            <Toolbar />
        </>
    );
}
