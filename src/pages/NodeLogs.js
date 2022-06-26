/* eslint-disable camelcase */
import React, { useEffect, useState, useRef, createRef } from 'react';
// material
import {
    Stack,
    Container,
    Typography,
    Box

} from '@mui/material';
import { useParams } from 'react-router-dom';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { LogViewer } from '@patternfly/react-log-viewer';

// components
import Page from '../components/Page';
import { useGetNodeByNodeIdQuery } from '../api/apiSlice';


// ----------------------------------------------------------------------

export default function NodeLogs() {

    const { nodeId } = useParams();

    // Get Data
    const { data, isLoading } = useGetNodeByNodeIdQuery(nodeId);

    // States
    const [connected, setConnected] = useState(false);

    const logRef = useRef();


    useEffect(() => {
        // const socket = io('http://localhost:8000');

        // socket.on('connect', () => {
        //     console.log('Connected');
        //     setConnected(true);

        //     socket.emit('getLogs', nodeId, response =>
        //         console.log('Identity:', response),
        //     );
        // });
        // socket.on('events', (data) => {
        //     console.log('event', data);
        // });
        // socket.on('exception', (data) => {
        //     console.log('event', data);
        // });
        // socket.on('disconnect', () => {
        //     console.log('Disconnected');
        // });

        const eventSource = new EventSource(`http://127.0.0.1:8000/nodes/${nodeId}/logs`);
        eventSource.onmessage = ({ data }) => {

            if (logRef.current) {
                // logRef.current.innerHTML += `<p>${data}\n</p>`;
                logRef.current.appendChild(document.createElement('p')).innerText = data;
            }
        }

        return () => {
            eventSource.close()
        }
    }, [nodeId])

    if (isLoading || !data) {
        return <Page title="Networks">
            <Container>
                <Typography variant="h4">
                    Node Logs
                </Typography>
                <Typography variant="subtitle1">
                    Loading...
                </Typography>
            </Container>
        </Page>
    }



    return (
        <Page title="Node Logs">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Node Logs
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Box ref={logRef} component="code" sx={{
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        whiteSpace: 'pre-wrap',
                        overflow: 'auto',
                        height: 'calc(100vh - 200px)',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '10px',
                        backgroundColor: '#2B2B2B',
                        color: "#fff",
                        margin: '10px',
                        overflowY: 'scroll',
                        overflowX: 'hidden',
                        WebkitOverflowScrolling: 'touch',
                        "& > p": {
                            mt: 1,
                        }
                    }} />
                    {/* <div style={{
                        width: '100%',
                        maxHeight: '100vh',
                        overflow: 'auto',
                    }} ref={logRef}>
                        Loading...
                    </div> */}
                    {/* <SyntaxHighlighter language="plaintext" style={docco} wrapLongLines ref={logRef}>
                        Loading...
                    </SyntaxHighlighter> */}
                </Stack>
            </Container>
        </Page>
    );
}
