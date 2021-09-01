import {Button, Card, CardContent, Chip, Dialog as Dialogue, DialogActions as DialogueActions, DialogContent as DialogueContent, DialogTitle as DialogueTitle, Paper, TextField} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {Add} from "@material-ui/icons";
import {useState} from "react";
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
    const [newLangCode, setNewLangCode] = useState('new-lang');
    let newLangIsValid: boolean = true, langError: string | undefined;
    if (newLangCode === '') {
        newLangIsValid = false;
        langError = 'The language code may not be empty';
    } else if (i18nData.langs.includes(newLangCode)) {
        newLangIsValid = false;
        langError = 'This language is already used in this project';
    } else if (disallowedPaths.test(newLangCode)) {
        newLangIsValid = false;
        langError = 'This text cannot be used as a path name';
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
                                    data.masterKeys = Object.fromEntries(
                                        Object.entries(data.data[lang]).map(
                                            ([name, data]) => ([name, Object.keys(data)])
                                        )
                                    );
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
                            label="Add language"
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
            <DialogueTitle>Add language</DialogueTitle>
            <DialogueContent>
                <TextField
                    autoFocus
                    label="Language code"
                    error={!newLangIsValid}
                    helperText={langError ?? "The code for the new language, usually two characters e.g. 'en'"}
                    fullWidth
                    value={newLangCode}
                    onChange={(event) => setNewLangCode(event.target.value)}
                />
            </DialogueContent>
            <DialogueActions>
                <Button onClick={() => {
                    setAddDialogueOpen(false);
                    setNewLangCode('new-lang');
                }}>
                    Cancel
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
                        });
                        setNewLangCode('new-lang');
                    }}
                    disabled={!newLangIsValid}
                >
                    Add
                </Button>
            </DialogueActions>
        </Dialogue>
    </>;
};