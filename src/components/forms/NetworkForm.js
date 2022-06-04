import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FieldArray } from 'formik';
import { Stack, TextField, Button, IconButton, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'material-react-toastify';
import { useState } from 'react';
import { useCreateNewNetworkMutation } from '../../api/apiSlice';
import Iconify from '../Iconify';


export default function NetworkForm() {

    // States
    const [nodesResponse, setNodesResponse] = useState({})

    // Mutations
    const [createNetwork] = useCreateNewNetworkMutation()
    const NetworkSchema = Yup.object().shape({
        name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name is required'),
        nodes: Yup.array().of(
            Yup.object().shape({
                node_name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Node Name is required'),
                grpc_port: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('GRPC Port is required'),
                libp2p_port: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('LibP2P Port is required'),
                jsonrpc_port: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('JSON RPC Port is required'),
            })
        ),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            nodes: [
                {
                    node_name: '',
                    grpc_port: 10000,
                    libp2p_port: 10001,
                    jsonrpc_port: 10002,
                },
            ],
        },
        validationSchema: NetworkSchema,
        onSubmit: async (values) => {
            const response = await createNetwork(values);
            toast.success('Network Created Successfully');
            setNodesResponse(response.data)
        },
    });

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } = formik;

    return (
        <FormikProvider value={formik}>
            {
                !nodesResponse.nodes && <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} flexDirection="column" spacing={2}>
                            <TextField
                                fullWidth
                                label="Name"
                                {...getFieldProps('name')}
                                error={Boolean(touched.name && errors.name)}
                                helperText={touched.name && errors.name}
                            />

                        </Stack>

                        <FieldArray name="nodes">
                            {({ push, remove }) => (
                                <Stack spacing={2}>
                                    {values.nodes.length > 0 &&
                                        values.nodes.map((node, index) => (
                                            <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                                <TextField
                                                    fullWidth
                                                    label="Node Name"
                                                    {...getFieldProps(`nodes.${index}.node_name`)}
                                                    error={Boolean(touched.nodes?.[index]?.node_name && errors.nodes?.[index]?.node_name)}
                                                    helperText={touched.nodes?.[index]?.node_name && errors.nodes?.[index]?.node_name}

                                                />
                                                <TextField
                                                    fullWidth
                                                    label="GRPC Port"
                                                    {...getFieldProps(`nodes.${index}.grpc_port`)}
                                                    error={Boolean(touched.nodes?.[index]?.grpc_port && errors.nodes?.[index]?.grpc_port)}
                                                    helperText={touched.nodes?.[index]?.grpc_port && errors.nodes?.[index]?.grpc_port}
                                                    type="number"
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="LibP2P Port"
                                                    {...getFieldProps(`nodes.${index}.libp2p_port`)}
                                                    error={Boolean(touched.nodes?.[index]?.libp2p_port && errors.nodes?.[index]?.libp2p_port)}
                                                    helperText={touched.nodes?.[index]?.libp2p_port && errors.nodes?.[index]?.libp2p_port}
                                                    type="number"
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="JSON RPC Port"
                                                    {...getFieldProps(`nodes.${index}.jsonrpc_port`)}
                                                    error={Boolean(touched.nodes?.[index]?.jsonrpc_port && errors.nodes?.[index]?.jsonrpc_port)}
                                                    helperText={touched.nodes?.[index]?.jsonrpc_port && errors.nodes?.[index]?.jsonrpc_port}
                                                    type="number"
                                                />
                                                <IconButton
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => remove(index)}
                                                    disabled={isSubmitting}
                                                >
                                                    <Iconify icon="ep:remove" />
                                                </IconButton>
                                            </Stack>
                                        ))}
                                    <Stack>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() =>
                                                push({
                                                    node_name: '',
                                                    grpc_port: '',
                                                    libp2p_port: '',
                                                    jsonrpc_port: '',
                                                })
                                            }
                                            disabled={isSubmitting}
                                        >
                                            Add Node
                                        </Button>
                                    </Stack>
                                </Stack>
                            )}
                        </FieldArray>

                        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                            Submit
                        </LoadingButton>
                    </Stack>
                </Form>
            }

            {
                nodesResponse.nodes?.length > 0 && (
                    <Stack spacing={2} mt={2}>
                        {
                            nodesResponse.nodes.map((node, index) => (
                                <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Typography>
                                        <b>Node Name:</b> {node.node?.node_name}
                                    </Typography>
                                    <Typography>
                                        <b>Node ID:</b> {node.nodeId}
                                    </Typography>
                                    <Typography>
                                        <b>Node Secret:</b> {node.privateKey}
                                    </Typography>
                                </Stack>))
                        }
                        <Typography variant="caption" component="h6" color="error">
                            Please write down the above secret keys and store it in a safe place then close the window. They will be removed and won't be saved in our storage.
                        </Typography>
                    </Stack>
                )
            }
        </FormikProvider>
    );
}
