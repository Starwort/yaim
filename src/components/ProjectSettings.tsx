import {Button, Card, CardContent, Chip, Dialog as Dialogue, DialogActions as DialogueActions, DialogContent as DialogueContent, DialogTitle as DialogueTitle, Paper, TextField} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {Add} from "@material-ui/icons";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {I18nRoot, LoadedI18nRoot} from "../misc";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            listStyle: 'none',
            padding: theme.spacing(0.5),
            margin: 0,
            backgroundColor: '#282828',
        },
        chip: {
            margin: theme.spacing(0.5),
        },
    }),
);

const disallowedPaths = new RegExp([
    /[<>:"/\\|?*]|/, // illegal characters
    /^CON|^PRN|^AUX|^NUL|/, // reserved names part 1
    /^COM[1-9]|^LPT[1-9]|/, // reserved names part 2
    // eslint-disable-next-line
    /[\x00-\x1F]|^\s*$/, // control and whitespace characters
].map(r => r.source).join(''), / /i.flags);

interface ProjectSettingsProps {
    i18nData: LoadedI18nRoot;
    setI18nData: (value: I18nRoot) => void;
}
export default function ProjectSettings({i18nData, setI18nData}: ProjectSettingsProps) {
    const classes = useStyles();
    const [addDialogueOpen, setAddDialogueOpen] = useState(false);
    const {t} = useTranslation('core');
    const [newLangCode, setNewLangCode] = useState<string>(t('core:new.lang'));
    let newLangIsValid: boolean = true, langError: string | undefined;
    if (newLangCode === '') {
        newLangIsValid = false;
        langError = t('core:project.error.lang_empty');
    } else if (i18nData.langs.includes(newLangCode)) {
        newLangIsValid = false;
        langError = t('core:project.error.lang_exists');
    } else if (disallowedPaths.test(newLangCode)) {
        newLangIsValid = false;
        langError = t('core:project.error.bad_path');
    }
    return <>
        <Card>
            <CardContent>
                <Paper component="ul" className={classes.root}>
                    {i18nData.langs.map(
                        lang => <li key={lang}>
                            <Chip
                                icon={undefined}
                                label={lang}
                                onDelete={lang === i18nData.master
                                    ? undefined
                                    : () => setI18nData({
                                        ...i18nData,
                                        langs: i18nData.langs.filter(item => item !== lang),
                                    })
                                }
                                className={classes.chip}
                                color={lang === i18nData.master ? 'primary' : undefined}
                                onClick={lang === i18nData.master ? undefined : () => {
                                    let data = {...i18nData};
                                    data.namespaces = Object.keys(data.data[lang]);
                                    data.master = lang;
                                    data.masterKeys = data.data[lang];
                                    for (let lang of data.langs) {
                                        for (let namespace of data.namespaces) {
                                            data.data[lang][namespace] = data.data[lang][namespace] ?? {};
                                        }
                                    }
                                    setI18nData(data);
                                }}
                            />
                        </li>
                    )}
                    <li>
                        <Chip
                            icon={<Add />}
                            label={t('core:project.add_lang.chip')}
                            className={classes.chip}
                            onClick={() => setAddDialogueOpen(true)}
                        />
                    </li>
                </Paper>
            </CardContent>
        </Card>
        <Dialogue
            open={addDialogueOpen}
            onClose={() => setAddDialogueOpen(false)}
            maxWidth="sm"
            fullWidth
        >
            <DialogueTitle>{t('core:project.add_lang.label.title')}</DialogueTitle>
            <DialogueContent>
                <TextField
                    autoFocus
                    label={t('core:project.add_lang.label.input')}
                    error={!newLangIsValid}
                    helperText={langError ?? t('core:project.add_lang.label.help')}
                    fullWidth
                    value={newLangCode}
                    onChange={(event) => setNewLangCode(event.target.value)}
                />
            </DialogueContent>
            <DialogueActions>
                <Button onClick={() => {
                    setAddDialogueOpen(false);
                    setNewLangCode(t('core:new.lang'));
                }}>
                    {t('core:button.cancel')}
                </Button>
                <Button
                    onClick={() => {
                        setAddDialogueOpen(false);
                        setI18nData({
                            ...i18nData,
                            data: {
                                ...i18nData.data,
                                [newLangCode]: Object.fromEntries(
                                    Object.keys(
                                        i18nData.data[i18nData.master]
                                    ).map(key => [key, {}])
                                ),
                            },
                            langs: [
                                ...i18nData.langs,
                                newLangCode,
                            ],
                            unsaved: true,
                        });
                        setNewLangCode(t('core:new.lang'));
                    }}
                    disabled={!newLangIsValid}
                >
                    {t('core:button.confirm')}
                </Button>
            </DialogueActions>
        </Dialogue>
    </>;
};