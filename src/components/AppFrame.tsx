import {Typography, useMediaQuery, useTheme} from '@material-ui/core';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {AppBar, DrawerAdjust, NavigationDrawer} from '.';
import {FileTree} from '../misc';
import {ThemeName} from '../themes';
import {LanguageDialogue} from './LanguageDialogue';


interface AppFrameProps {
    setTheme: (value: ThemeName) => void;
    children: React.ReactNode;
    fileTree: FileTree;
}
let initialRenders = 10;
export function AppFrame(props: AppFrameProps) {
    const theme = useTheme();
    const startOpen = useMediaQuery(theme.breakpoints.up('lg'));
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    if (initialRenders) {
        console.log(initialRenders, startOpen);
        if (startOpen && !drawerOpen) {
            initialRenders = 0;
            setDrawerOpen(true);
        } else {
            initialRenders--;
        }
    }
    const {t, i18n} = useTranslation('core');
    const [langOpen, setLangOpen] = React.useState(false);
    return (
        <>
            <AppBar
                setDrawerOpen={setDrawerOpen}
                drawerOpen={drawerOpen}
                title={
                    <Typography variant="h6">
                        {t('core:title')}
                    </Typography>
                }
            />
            <NavigationDrawer
                open={drawerOpen}
                setOpen={setDrawerOpen}
                setTheme={props.setTheme}
                setLangOpen={setLangOpen}
            />
            <LanguageDialogue open={langOpen} setLang={(value: string) => {
                i18n.changeLanguage(value);
                setLangOpen(false);
            }} />
            <DrawerAdjust active={drawerOpen}>
                {props.children}
            </DrawerAdjust>
        </>
    );
}
