import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../utils/constants'

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        networks: builder.query({
            query: () => ({ url: '/networks' }),
            providesTags: ['Network'],
        }),
        singleNetwork: builder.query({
            query: (networkId) => ({ url: `/networks/${networkId}` }),
        }),

        createNewNetwork: builder.mutation({
            query: (network) => ({
                url: 'networks',
                method: 'POST',
                body: {
                    ...network,
                    user_id: 3
                },
            }),
            transformResponse: (response) => response,
            invalidatesTags: ['Network'],
        }),

        generateGenesis: builder.mutation({
            query: (data) => ({
                url: `networks/genesis-block/${data.networkId}`,
                method: 'POST',
                body: data
            }),
            transformResponse: (response) => response,
            invalidatesTags: ['Network'],
        }),

        getNodesByNetwork: builder.query({
            query: (networkId) => ({ url: `/nodes/byNetwork/${networkId}` }),
            providesTags: ['Node'],
        }),

        runNode: builder.mutation({
            query: (nodeId) => ({
                url: `nodes/${nodeId}/run`,
                method: 'POST',
            }),
            transformResponse: (response) => response,
            invalidatesTags: ['Node'],
        }),
        killNode: builder.mutation({
            query: (nodeId) => ({
                url: `nodes/${nodeId}/kill`,
                method: 'POST',
            }),
            transformResponse: (response) => response,
            invalidatesTags: ['Node'],
        }),

        getNodeByNodeId: builder.query({
            query: (nodeId) => ({ url: `/nodes/${nodeId}` }),
            providesTags: ['Node'],
        }),






        register: builder.mutation({
            query: ({ ...body }) => ({
                url: `users`,
                method: 'POST',
                body,
            }),
            transformResponse: (response) => response,
            invalidatesTags: ['User'],
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useNetworksQuery,
    useCreateNewNetworkMutation,
    useSingleNetworkQuery,
    useGenerateGenesisMutation,

    useGetNodesByNetworkQuery,
    useGetNodeByNodeIdQuery,
    useRunNodeMutation,
    useKillNodeMutation,

    useRegisterMutation,
} = apiSlice