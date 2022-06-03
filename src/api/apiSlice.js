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
export const { useNetworksQuery, useCreateNewNetworkMutation, useRegisterMutation } = apiSlice