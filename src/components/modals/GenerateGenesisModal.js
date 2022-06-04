import { AppBar, CircularProgress, Dialog, DialogContent, DialogContentText, IconButton, Stack, Toolbar, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { toast } from "material-react-toastify";
import { useGenerateGenesisMutation, useSingleNetworkQuery } from "../../api/apiSlice";
import Iconify from "../Iconify";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


GenerateGenesisBlockModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleModal: PropTypes.func.isRequired,
    networkId: PropTypes.number,
}

export default function GenerateGenesisBlockModal({ networkId, show, handleModal }) {

    // State
    const [selectedNodes, setSelectedNodes] = useState([])
    const [premine, setPremine] = useState("")

    // Mutations
    const [generateGenesisBlock, { isLoading: loading }] = useGenerateGenesisMutation()
    // Queries
    const { data, isLoading } = useSingleNetworkQuery(networkId, {
        skip: !networkId,
    });

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedNodes(value);
    };

    const generate = async () => {
        await generateGenesisBlock({
            bootnodes: selectedNodes.map(node => node.node_id),
            premine,
            networkId
        })

        toast.success("Genesis Block Generated Successfully")
        handleModal()
    }

    return (
        <Dialog open={show} onClose={handleModal} fullWidth>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleModal}
                        aria-label="close"
                    >
                        <Iconify icon="ant-design:close-outlined" />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Generate Genesis Block
                    </Typography>

                </Toolbar>
            </AppBar>
            <DialogContent>
                <DialogContentText>
                    Choose nodes for <b>Bootnode</b>.
                </DialogContentText>
                <Stack spacing={2}>
                    {
                        isLoading ? <CircularProgress /> : <FormControl>
                            <InputLabel id="demo-multiple-checkbox-label">Bootnode</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={selectedNodes}
                                onChange={handleChange}
                                input={<OutlinedInput label="Bootnode" />}
                                renderValue={(selected) => selected.map((value) => value.node_name).join(', ')}
                                MenuProps={MenuProps}
                            >
                                {data?.nodes?.map((node) => (
                                    <MenuItem key={node.node_id} value={node}>
                                        <Checkbox checked={selectedNodes.indexOf(node) > -1} />
                                        <ListItemText primary={node.node_name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    }
                    <Typography component="h6" variant="caption" >
                        If you want you can set a public key for premine account. It's not required.
                    </Typography>
                    <TextField
                        fullWidth
                        label="Premine Account"
                        name="premine"
                        variant="outlined"
                        margin="normal"
                        value={premine}
                        onChange={(e) => setPremine(e.target.value)}
                    />
                </Stack>
                <Typography component="h6" variant="body1" color="orange" mt={2} mb={3}>
                    Choose at least 2 nodes for <b>Bootnode</b>.
                </Typography>

                <LoadingButton loading={loading} variant="contained" fullWidth onClick={generate}>
                    Generate
                </LoadingButton>

            </DialogContent>
        </Dialog>
    )
}