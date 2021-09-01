import {Button, Card, CardContent, Dialog as Dialogue, DialogActions as DialogueActions, DialogContent as DialogueContent, DialogTitle as DialogueTitle, Grid, IconButton, InputAdornment, List, ListItem, ListItemIcon, ListItemText, TextField} from "@material-ui/core";
import {Add, DeleteForever, Done} from "@material-ui/icons";
import {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {I18nRoot, LoadedI18nRoot} from "../misc";
import {Centred} from "./Centred";
import KeyRow from "./KeyRow";

interface NamespaceContentProps {
    i18nData: LoadedI18nRoot;
    setI18nData: (value: I18nRoot) => void;
}
export default function NamespaceContent({i18nData, setI18nData}: NamespaceContentProps) {
    const {namespace} = useParams<{namespace: string;}>();
    const history = useHistory();
    const [newName, setNewName] = useState(namespace);
    const [dialogueOpen, setDialogueOpen] = useState(false);
    const [newKey, setNewKey] = useState('my.fancy.new.key');
    let newKeyIsValid = true, keyError: string | undefined;
    if (newKey === '') {
        newKeyIsValid = false;
        keyError = 'Key cannot be empty';
    } else if (i18nData.masterKeys[namespace].filter(item => item.startsWith(newKey)).length) {
        newKeyIsValid = false;
        keyError = 'Key exists or is a group';
    }
    const nsExists = namespace !== newName && i18nData.namespaces.includes(newName);
    useEffect(
        () => setNewName(namespace),
        [namespace],
    );
    const updateNSName = () => {
        if (newName === namespace || nsExists) {
            return;
        }
        let newNamespaces = i18nData.data;
        for (let namespaces of Object.values(newNamespaces)) {
            namespaces[newName] = namespaces[namespace];
            delete namespaces[namespace];
        }
        setI18nData({...i18nData, data: newNamespaces, namespaces: Object.keys(newNamespaces[i18nData.master])});
        history.replace(`/${newName}`);
    };
    const removeNS = () => {
        let newNamespaces = i18nData.data;
        for (let namespaces of Object.values(newNamespaces)) {
            delete namespaces[namespace];
        }
        setI18nData({...i18nData, data: newNamespaces, namespaces: Object.keys(newNamespaces[i18nData.master])});
        history.replace('/');
    };
    return <>
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Namespace name"
                            value={newName}
                            onChange={
                                (event) => setNewName(event.target.value)
                            }
                            error={nsExists}
                            helperText={nsExists ? 'A namespace with this name exists already' : ''}
                            onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                    updateNSName();
                                    ev.preventDefault();
                                }
                            }}
                            fullWidth
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        style={{color: nsExists ? undefined : 'green'}}
                                        onClick={updateNSName}
                                        disabled={nsExists}
                                    >
                                        <Done />
                                    </IconButton>
                                </InputAdornment>
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Centred>
                            <Button
                                startIcon={<DeleteForever />}
                                onClick={removeNS}
                            >
                                Delete namespace
                            </Button>
                        </Centred>
                    </Grid>
                </Grid>
            </CardContent>
            <List>
                {i18nData.masterKeys[namespace].map(
                    key => <KeyRow
                        key={key}
                        i18nData={i18nData}
                        setI18nData={setI18nData}
                        transKey={key}
                        namespace={namespace}
                    />
                )}
                <ListItem button onClick={() => setDialogueOpen(true)}>
                    <ListItemIcon>
                        <Add />
                    </ListItemIcon>
                    <ListItemText>
                        Add new key
                    </ListItemText>
                </ListItem>
            </List>
        </Card>
        <Dialogue
            open={dialogueOpen}
            onClose={() => setDialogueOpen(false)}
            maxWidth="sm"
            fullWidth
        >
            <DialogueTitle>Add language</DialogueTitle>
            <DialogueContent>
                <TextField
                    autoFocus
                    label="Language code"
                    error={!newKeyIsValid}
                    helperText={keyError ?? "The new key, consisting of parts separated by dots (.)"}
                    fullWidth
                    value={newKey}
                    onChange={(event) => setNewKey(event.target.value)}
                />
            </DialogueContent>
            <DialogueActions>
                <Button onClick={() => {
                    setDialogueOpen(false);
                    setNewKey('my.fancy.new.key');
                }}>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        setDialogueOpen(false);
                        setI18nData({
                            ...i18nData,
                            masterKeys: {
                                ...i18nData.masterKeys,
                                [namespace]: [...i18nData.masterKeys[namespace], newKey],
                            },
                            unsaved: true,
                        });
                        setNewKey('my.fancy.new.key');
                    }}
                    disabled={!newKeyIsValid}
                >
                    Add
                </Button>
            </DialogueActions>
        </Dialogue>
    </>;
}