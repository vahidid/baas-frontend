/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
// material
import {

    Stack,

    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    IconButton,
    CircularProgress,

} from '@mui/material';
import { useParams, Link as RouteLink } from 'react-router-dom';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';
import * as beautify from 'js-beautify';
import { sentenceCase } from 'change-case';
import { toast } from 'material-react-toastify';

// components
import Page from '../components/Page';
import { useGetNodesByNetworkQuery, useKillNodeMutation, useRunNodeMutation, useSingleNetworkQuery } from '../api/apiSlice';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import Label from '../components/Label';
import NodeListHead from '../sections/@dashboard/node/NodeListHead';

const TABLE_HEAD = [
    { id: 'node_name', label: 'Node Name', alignRight: false },
    { id: 'node_id', label: 'Node ID', alignRight: false },
    { id: 'grpc_port', label: 'GRPC Port', alignRight: false },
    { id: 'libp2p_port', label: 'LibP2P Port', alignRight: false },
    { id: 'jsonrpc_port', label: 'JSON RPC Port', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'pid', label: 'PID', alignRight: false },
    { id: '' },
];

// ----------------------------------------------------------------------

export default function NetworkDetails() {

    const { id } = useParams();

    // Get Data
    const { data, isLoading } = useSingleNetworkQuery(id);
    const { data: nodes, isLoading: isLoadingNodes } = useGetNodesByNetworkQuery(id);

    // Mutations
    const [runNode] = useRunNodeMutation()
    const [killNode] = useKillNodeMutation()

    if (isLoading || !data) {
        return <Page title="Networks">
            <Container>
                <Typography variant="h4">
                    Network Details
                </Typography>
                <Typography variant="subtitle1">
                    Loading...
                </Typography>
            </Container>
        </Page>
    }


    const handleRunNode = async (nodeId) => {
        await runNode(nodeId);

        toast.success(`Node ${nodeId} is running`);
    }

    const handleKillNode = async (nodeId) => {
        await killNode(nodeId);

        toast.error(`Node ${nodeId} is killing`);
    }



    return (
        <Page title="Networks">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Network Details
                    </Typography>
                </Stack>
                <Card sx={{ mb: 3 }}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<Iconify icon="ant-design:caret-down-filled" />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography variant="subtitle1" gutterBottom component="h6">
                                Genesis Block JSON:
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                                <SyntaxHighlighter language="json" style={docco} wrapLongLines>
                                    {beautify(JSON.stringify(data.genesis, null, 2), { indent_size: 2 })}
                                </SyntaxHighlighter>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </Card>

                <Card>
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }} >
                            <Table>
                                <NodeListHead
                                    headLabel={TABLE_HEAD}
                                    rowCount={data.length}
                                />
                                <TableBody>
                                    {nodes?.map((row) => {
                                        const { id, node_name, status, node_id, grpc_port, libp2p_port, jsonrpc_port, pid } = row;

                                        return (
                                            <TableRow
                                                hover
                                                key={id}
                                                tabIndex={-1}
                                            >
                                                <TableCell component="th" scope="row" >
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Typography variant="subtitle2" noWrap>
                                                            {node_name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell component="th" scope="row" >
                                                    <Stack direction="row" alignItems="start" spacing={2}>
                                                        <Typography variant="subtitle2">
                                                            {node_id.substring(0, 15)}...
                                                            <IconButton aria-label="copy" color='secondary' onClick={() => {
                                                                navigator.clipboard.writeText(node_id);
                                                                toast.info('Copied to clipboard');
                                                            }}>
                                                                <Iconify icon="akar-icons:copy" />
                                                            </IconButton>
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="left">{
                                                    grpc_port
                                                }</TableCell>
                                                <TableCell align="left">{
                                                    libp2p_port
                                                }</TableCell>
                                                <TableCell align="left">{
                                                    jsonrpc_port
                                                }</TableCell>
                                                <TableCell align="left">
                                                    <Label variant="ghost" color={(status === 'deactive' && 'error') || 'success'}>
                                                        {sentenceCase(status)}
                                                    </Label>
                                                </TableCell>
                                                <TableCell align="left">{
                                                    pid
                                                }</TableCell>
                                                <TableCell align="right">
                                                    {
                                                        status === "deactive" ? <Tooltip title="Run" placement="top">
                                                            <IconButton aria-label="run" color='success' onClick={() => handleRunNode(node_id)}>
                                                                <Iconify icon="fa6-solid:play" />
                                                            </IconButton>
                                                        </Tooltip> : <Stack direction={{ sm: 'row', xs: 'column' }}>
                                                            <Tooltip title="Kill" placement="top">
                                                                <IconButton aria-label="kill" color='error' onClick={() => handleKillNode(node_id)}>
                                                                    <Iconify icon="fluent:record-stop-12-regular" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Logs" placement="top">
                                                                <IconButton aria-label="logs" color='primary' component={RouteLink} to={`/dashboard/nodes/${node_id}`}>
                                                                    <Iconify icon="ep:document" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    }


                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}

                                </TableBody>

                                {isLoadingNodes && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>


                </Card>
            </Container>
        </Page>
    );
}
