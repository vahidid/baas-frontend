import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../utils/constants'

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        register: builder.mutation({
            // note: an optional `queryFn` may be used in place of `query`
            query: ({ ...body }) => ({
                url: `users`,
                method: 'POST',
                body,
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response) => response,
            invalidatesTags: ['User'],
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useRegisterMutation } = apiSlice