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
import {Typography, useMediaQuery, useTheme} from '@material-ui/core';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {AppBar, DrawerAdjust, NavigationDrawer} from '.';
import {ThemeName} from '../themes';
import {LanguageDialogue} from './LanguageDialogue';


interface AppFrameProps {
    setTheme: (value: ThemeName) => void;
    children: React.ReactNode;
    fileTree: React.ReactNode;
}
export function AppFrame(props: AppFrameProps) {
    const theme = useTheme();
    const startOpen = useMediaQuery(theme.breakpoints.up('lg'));
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    React.useEffect(() => {
        setDrawerOpen(startOpen);
    }, [startOpen]);
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
            >
                {props.fileTree}
            </NavigationDrawer>
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
