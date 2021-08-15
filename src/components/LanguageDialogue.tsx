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
import {Dialog, DialogTitle, List, ListItem, ListItemText} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {availableLocalisations} from "../i18n";

interface LanguageDialogueProps {
    open: boolean;
    setLang: (lang: string) => void;
}

export function LanguageDialogue(props: LanguageDialogueProps) {
    const {t} = useTranslation('core');
    return <Dialog aria-labelledby="lang-dialogue-title" open={props.open} PaperProps={{style: {width: 250}}}>
        <DialogTitle style={{textAlign: 'center'}} id="lang-dialogue-title">{t('core:lang.choose')}</DialogTitle>
        <List>
            {availableLocalisations.map(lang =>
                <ListItem key={lang} style={{textAlign: 'center'}} button onClick={() => props.setLang(lang)}>
                    <ListItemText primary={t(`core:lang.${lang}`)} />
                </ListItem>
            )}
        </List>
    </Dialog>;
}
