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