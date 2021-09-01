import {Button, Card, CardContent, Grid, IconButton, InputAdornment, List, TextField} from "@material-ui/core";
import {DeleteForever, Done} from "@material-ui/icons";
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
            </List>
        </Card>
    </>;
}