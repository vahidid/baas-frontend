import { Badge, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { toast } from "material-react-toastify";
import { useEffect, useMemo, useState } from "react";
import Web3 from 'web3';
import Iconify from "../components/Iconify";
import Page from "../components/Page";

const web3 = new Web3('ws://37.32.31.226:50002/ws');


export default function Laboratory() {




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

        const eventSource = new EventSource(`http://127.0.0.1:8000/logs/docker`);
        eventSource.onmessage = ({ data }) => {
            console.log(data);
        }

        return () => {
            eventSource.close()
        }
    }, [])


    const [accounts, setAccounts] = useState([]);
    const [connected, setConnected] = useState(false);

    const [createdAccount, setCreatedAccount] = useState({});
    const [inputAccount, setInputAccount] = useState('');
    const [accountBalance, setAccountBalance] = useState('');
    const [availableBalance, setAvailableBalance] = useState('');

    const getAccount = async () => {


        // const accounts = await web3.eth.accounts.create()
        // console.log(accounts)
        // // setAccounts(accounts)

        // 0x77571bd60e4bcad05868b00f317b1abe00b58bca8a00671cbeaab0977ee0069d

        const block = await window.ethereum.request({
            method: 'eth_getBlockByHash', params: [
                "0x77571bd60e4bcad05868b00f317b1abe00b58bca8a00671cbeaab0977ee0069d"
            ]
        })
        console.log("BLOCK: ", block)

        const tx = await window.ethereum.request({
            method: 'eth_getTransactionByHash', params: [
                block.transactions[0]
            ]
        })

        console.log("TX: ", tx)

    }

    const createAccount = async () => {

        const accounts = web3.eth.accounts.create();
        setCreatedAccount(accounts);
        console.log(accounts)
    }

    const fundAccount = async () => {
        web3.eth.accounts
            .signTransaction(
                {
                    to: inputAccount,
                    value: web3.utils.toWei("100"),
                    gas: 21000,
                },
                "bf30f2a3ac671ff6ef671a2a2385447078bcba8570d69e7fa5acbd3b675dc5c1"
            )
            .then((signedTxData) => {
                web3.eth
                    .sendSignedTransaction(signedTxData.rawTransaction)
                    .on("receipt", console.log);
            });
    }

    const getAccountBalance = async () => {
        const balance = await web3.eth.getBalance(accountBalance);
        setAvailableBalance(web3.utils.fromWei(balance, 'ether'));
    }

    const getAccountFromMetaMask = async () => {
        if (typeof window.ethereum === 'undefined') {
            toast.info("MetaMask is installed!");
            return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setInputAccount(account);
    }

    const connectToMetaMask = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x64' }],
            });
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            setInputAccount(account);
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: '0xf00',
                                chainName: 'Custom Chain',
                                rpcUrls: ['http://localhost:10002'] /* ... */,
                                nativeCurrency: {
                                    name: "xDAI",
                                    symbol: "xDAI", // 2-6 characters long
                                    decimals: 18
                                }
                            },
                        ],
                    });
                } catch (addError) {
                    // handle "add" error
                }
            }
            // handle other "switch" errors
        }
    }

    useEffect(() => {
        window.ethereum.request({
            method: 'eth_newBlockFilter',
            params: [],
        }).then((result) => {

            window.ethereum.request({
                method: 'eth_getTransactionCount',
                params: ["0x27d295f19ae7b1f7a4ceace3102e086c09fa4180", "latest"],
            }).then((res) => {
                console.log("res", res)
            })

            console.log("RESULT: ", result)
        });
    }, [])





    return <Page title="Laboratory">
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Laboratory
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={getAccount} startIcon={<Iconify icon="eva:plus-fill" />}>
                        Get Accounts
                    </Button>
                    {
                        window.ethereum?.isConnected() ? <Badge color="success" variant="dot">
                            <Typography>
                                Connected
                            </Typography>
                        </Badge> : <Button variant="outlined" onClick={connectToMetaMask} color="info" startIcon={<Iconify icon="logos:metamask-icon" />}>
                            Connect To MetaMask
                        </Button>
                    }

                </Stack>
            </Stack>
            <Stack>
                {
                    accounts.map(account => <Typography key={account}>{account}</Typography>)
                }
            </Stack>

            <Stack spacing={2}>
                <Typography variant="h5">
                    Create Account
                </Typography>
                {
                    createdAccount.address && <Stack>
                        <Typography>
                            <b>Address: </b>{createdAccount.address}
                        </Typography>
                        <Typography>
                            <b>Private Key: </b>{createdAccount.privateKey}
                        </Typography>
                    </Stack>
                }
                <Stack direction="column" alignItems="flex-start">
                    {
                        !createdAccount.address ? <Button variant="contained" onClick={createAccount} startIcon={<Iconify icon="eva:plus-fill" />}>
                            Create
                        </Button> : <Button variant="outlined" onClick={() => setInputAccount(createdAccount.address)}>
                            Fund
                        </Button>
                    }
                </Stack>

            </Stack>

            <Stack spacing={2} sx={{ mt: 4 }}>
                <Typography variant="h5">
                    Fund Account
                </Typography>
                <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    variant="outlined"
                    value={inputAccount}
                    onChange={(e) => setInputAccount(e.target.value)}
                />

                <Stack direction="column" alignItems="flex-start">
                    <Button variant="contained" color="secondary" onClick={fundAccount} >
                        Fund 100 token
                    </Button>
                </Stack>
            </Stack>

            <Stack spacing={2} sx={{ mt: 4 }}>
                <Typography variant="h5">
                    Get Account Balance
                </Typography>
                <Stack direction="column" alignItems="flex-start">
                    <Button variant="contained" color="secondary" onClick={getAccountFromMetaMask}>
                        Get Account from MetaMask
                    </Button>
                </Stack>
                <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    variant="outlined"
                    value={accountBalance}
                    onChange={(e) => setAccountBalance(e.target.value)}
                />

                <Typography>
                    {availableBalance} ETH
                </Typography>

                <Stack direction="column" alignItems="flex-start">
                    <Button variant="contained" color="secondary" onClick={getAccountBalance} >
                        Get Balance
                    </Button>
                </Stack>
            </Stack>
        </Container>
    </Page>
}